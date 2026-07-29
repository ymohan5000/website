export declare function sendContactNotification(data: {
    name: string;
    email: string;
    phone?: string;
    service?: string;
    message: string;
}): Promise<void>;
