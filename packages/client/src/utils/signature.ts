import axios from "axios";
import { DEFAULT_SIGNATURE_VALUE } from "../constants";

export const getSignature = async (method: string, args: Record<string, any>, signatureApiUrl?: string): Promise<any> => {
    if (!signatureApiUrl) {
        return DEFAULT_SIGNATURE_VALUE;
    }

    const res = await axios.post(signatureApiUrl, {
        method,
        args,
    });

    return JSON.parse(res.data.result);
}
