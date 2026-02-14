import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                    <h2 className="text-xl font-bold mb-2">Terjadi Kesalahan</h2>
                    <p className="text-muted-foreground mb-4 max-w-md">
                        Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba muat ulang atau hubungi administrator jika masalah berlanjut.
                    </p>
                    <pre className="bg-muted p-4 rounded text-xs text-left overflow-auto max-w-lg w-full mb-4">
                        {this.state.error?.message}
                    </pre>
                    <button
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                        onClick={() => window.location.reload()}
                    >
                        Muat Ulang Halaman
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
