import React, { Component, ErrorInfo } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
                    <div className="glass rounded-2xl p-8 max-w-md w-full text-center space-y-6 animate-fade-in-up border border-white/10 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">Something went wrong</h2>
                            <p className="text-muted-foreground text-sm">
                                An unexpected error occurred and the application could not recover.
                            </p>
                            {this.state.error && (
                                <div className="mt-4 p-3 bg-black/40 rounded-lg text-left overflow-x-auto border border-red-500/20">
                                    <p className="font-mono text-xs text-red-400">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}
                        </div>
                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full h-12 text-lg font-semibold bg-red-500 hover:bg-red-600 text-white"
                        >
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Reload Application
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
