"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Cart, CartItem, GuestCart, UnifiedCart } from "@/app/cart/_types/cart.types";
import { cartService } from "@/app/cart/_services/cartService";
import { productService } from "@/services/productService";
import { useAuth } from "@/contexts/AuthContext";

type CartContextType = {
    cart: UnifiedCart | null;
    isLoading: boolean;
    addToCart: (productId: number, quantity?: number) => Promise<void>;
    removeFromCart: (productId: number) => Promise<void>;
    updateQuantity: (productId: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    itemCount: number;
    isGuestCart: boolean;
    syncGuestCartToBackend: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = "guestCart";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, handleAuthError } = useAuth();

    const [cart, setCart] = useState<UnifiedCart | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isGuestCart, setIsGuestCart] = useState(false);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    // ── Auth error event listener (cartService'ten gelir) ──────────────────────
    useEffect(() => {
        const onAuthError = () => {
            // Token expire: state temizle + login modal aç
            setCart(null);
            setIsGuestCart(true);
            handleAuthError();
        };

        window.addEventListener("auth:unauthorized", onAuthError);
        return () => window.removeEventListener("auth:unauthorized", onAuthError);
    }, [handleAuthError]);

    // ── isAuthenticated değişince sepeti yeniden yükle ─────────────────────────
    useEffect(() => {
        loadCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    const loadCart = async () => {
        if (isAuthenticated) {
            await refreshCart();
            setIsGuestCart(false);
        } else {
            await loadGuestCart();
            setIsGuestCart(true);
        }
    };

    // ── Guest cart ─────────────────────────────────────────────────────────────

    const loadGuestCart = async () => {
        try {
            const guestCartData = localStorage.getItem(GUEST_CART_KEY);
            if (!guestCartData) { setCart(null); return; }

            const guestCart: GuestCart = JSON.parse(guestCartData);
            if (guestCart.items.length === 0) {
                setCart({ items: [], totalPrice: 0, totalItems: 0 });
                return;
            }

            const productIds = guestCart.items.map(item => item.productId);
            const products = await productService.getProductsByIds(productIds);
            const productMap = new Map(products.map(p => [p.id, p]));

            const cartItems: CartItem[] = guestCart.items
                .map((guestItem, index) => {
                    const product = productMap.get(guestItem.productId);
                    if (!product) return null;

                    const activePrice = product.discountedPrice || product.price;
                    const categoryName =
                        typeof product.category === "object"
                            ? product.category.name
                            : product.category;

                    return {
                        id: index,
                        product: {
                            id: product.id,
                            title: product.title,
                            imageUrl: product.imageUrl,
                            price: product.price,
                            discountedPrice: product.discountedPrice,
                            stockQuantity: product.stockQuantity,
                            category: categoryName,
                        },
                        quantity: guestItem.quantity,
                        subtotal: activePrice * guestItem.quantity,
                        addedAt: new Date().toISOString(),
                    };
                })
                .filter((item): item is CartItem => item !== null);

            const totalPrice = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            setCart({ items: cartItems, totalPrice, totalItems });
        } catch (error) {
            console.error("Misafir sepeti yüklenemedi:", error);
            localStorage.removeItem(GUEST_CART_KEY);
            setCart(null);
        }
    };

    const saveGuestCart = (items: CartItem[]) => {
        try {
            const guestCart: GuestCart = {
                items: items.map(item => ({ productId: item.product.id, quantity: item.quantity })),
            };
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
        } catch (error) {
            console.error("Misafir sepeti kaydedilemedi:", error);
        }
    };

    // ── Backend cart ───────────────────────────────────────────────────────────

    const refreshCart = async () => {
        if (!isAuthenticated) {
            await loadGuestCart();
            setIsGuestCart(true);
            return;
        }

        try {
            setIsLoading(true);
            const backendCart = await cartService.getCart();
            if (backendCart) {
                setCart({
                    items: backendCart.items,
                    totalPrice: backendCart.totalPrice,
                    totalItems: backendCart.totalItems,
                });
                setIsGuestCart(false);
            }
        } catch (error: any) {
            // SESSION_EXPIRED zaten handleAuthError ile handle edildi
            if (error?.message !== "SESSION_EXPIRED") {
                console.error("Sepet yüklenemedi:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ── Sync guest → backend ──────────────────────────────────────────────────

    const syncGuestCartToBackend = async () => {
        if (!isAuthenticated || !isGuestCart || !cart || cart.items.length === 0) return;

        try {
            setIsLoading(true);
            for (const item of cart.items) {
                await cartService.addToCart(item.product.id, item.quantity);
            }
            localStorage.removeItem(GUEST_CART_KEY);
            await refreshCart();
        } catch (error) {
            console.error("Sepet senkronizasyonu başarısız:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ── Add ────────────────────────────────────────────────────────────────────

    const addToCart = async (productId: number, quantity: number = 1) => {
        if (isAuthenticated) {
            try {
                setIsLoading(true);
                const updatedCart = await cartService.addToCart(productId, quantity);
                setCart({ items: updatedCart.items, totalPrice: updatedCart.totalPrice, totalItems: updatedCart.totalItems });
                setIsGuestCart(false);
                openCart();
            } catch (error: any) {
                if (error?.message !== "SESSION_EXPIRED") {
                    alert(error.message || "Sepete eklenemedi");
                }
                throw error;
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                setIsLoading(true);
                const product = await productService.getProductById(productId);
                const categoryName = typeof product.category === "object" ? product.category.name : product.category;
                const currentItems = cart?.items || [];
                const existingIndex = currentItems.findIndex(item => item.product.id === productId);
                let updatedItems: CartItem[];

                if (existingIndex >= 0) {
                    updatedItems = [...currentItems];
                    const newQty = updatedItems[existingIndex].quantity + quantity;
                    const activePrice = product.discountedPrice || product.price;
                    updatedItems[existingIndex] = { ...updatedItems[existingIndex], quantity: newQty, subtotal: activePrice * newQty };
                } else {
                    const activePrice = product.discountedPrice || product.price;
                    updatedItems = [...currentItems, {
                        id: Date.now(),
                        product: { id: product.id, title: product.title, imageUrl: product.imageUrl, price: product.price, discountedPrice: product.discountedPrice, stockQuantity: product.stockQuantity, category: categoryName },
                        quantity,
                        subtotal: activePrice * quantity,
                        addedAt: new Date().toISOString(),
                    }];
                }

                const totalPrice = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
                const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
                setCart({ items: updatedItems, totalPrice, totalItems });
                saveGuestCart(updatedItems);
                setIsGuestCart(true);
                openCart();
            } catch (error: any) {
                alert(error.message || "Ürün bilgisi alınamadı");
            } finally {
                setIsLoading(false);
            }
        }
    };

    // ── Remove ─────────────────────────────────────────────────────────────────

    const removeFromCart = async (productId: number) => {
        if (isAuthenticated) {
            try {
                setIsLoading(true);
                const updatedCart = await cartService.removeItem(productId);
                setCart({ items: updatedCart.items, totalPrice: updatedCart.totalPrice, totalItems: updatedCart.totalItems });
            } catch (error: any) {
                if (error?.message !== "SESSION_EXPIRED") alert(error.message || "Ürün çıkarılamadı");
            } finally {
                setIsLoading(false);
            }
        } else {
            if (!cart) return;
            const updatedItems = cart.items.filter(item => item.product.id !== productId);
            const totalPrice = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
            const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            setCart({ items: updatedItems, totalPrice, totalItems });
            saveGuestCart(updatedItems);
        }
    };

    // ── Update quantity ────────────────────────────────────────────────────────

    const updateQuantity = async (productId: number, quantity: number) => {
        if (quantity < 1) { await removeFromCart(productId); return; }

        if (isAuthenticated) {
            try {
                setIsLoading(true);
                const updatedCart = await cartService.updateQuantity(productId, quantity);
                setCart({ items: updatedCart.items, totalPrice: updatedCart.totalPrice, totalItems: updatedCart.totalItems });
            } catch (error: any) {
                if (error?.message !== "SESSION_EXPIRED") {
                    const msg = error.message || "Miktar güncellenemedi";
                    if (msg.includes("Yetersiz stok")) {
                        const match = msg.match(/Mevcut: (\d+)/);
                        alert(`❌ Yetersiz stok! Mevcut: ${match ? match[1] : "?"} adet`);
                    } else {
                        alert(msg);
                    }
                    await refreshCart();
                }
            } finally {
                setIsLoading(false);
            }
        } else {
            if (!cart) return;
            const updatedItems = cart.items.map(item => {
                if (item.product.id !== productId) return item;
                const activePrice = item.product.discountedPrice || item.product.price;
                return { ...item, quantity, subtotal: activePrice * quantity };
            });
            const totalPrice = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
            const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            setCart({ items: updatedItems, totalPrice, totalItems });
            saveGuestCart(updatedItems);
        }
    };

    // ── Clear ──────────────────────────────────────────────────────────────────

    const clearCart = async () => {
        setCart(null);
        localStorage.removeItem(GUEST_CART_KEY);
        setIsLoading(false);

        if (isAuthenticated) {
            try {
                await cartService.clearCart();
            } catch {
                console.warn("Backend sepet temizleme hatası, devam ediliyor.");
            } finally {
                setCart(null);
            }
        }
    };

    const itemCount = cart?.totalItems || 0;

    return (
        <CartContext.Provider value={{
            cart, isLoading, itemCount,
            addToCart, removeFromCart, updateQuantity, clearCart, refreshCart,
            isCartOpen, openCart, closeCart,
            isGuestCart, syncGuestCartToBackend,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};