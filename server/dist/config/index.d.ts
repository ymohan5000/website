export declare const config: {
    port: number;
    nodeEnv: string;
    clientUrl: string;
    mongodbUri: string;
    jwt: {
        secret: string;
        expiresIn: string;
    };
    cloudinary: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
    };
    openaiApiKey: string;
    geminiApiKey: string;
    smtp: {
        host: string;
        port: number;
        user: string;
        pass: string;
    };
};
