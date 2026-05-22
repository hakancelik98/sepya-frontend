export function getErrorMessage(error: any): string {
    // Backend JSON error: { message: "..." }
    if (error?.message) {
        return error.message;
    }

    // Fetch response error
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }

    return "Bilinmeyen bir hata oluştu";
}
