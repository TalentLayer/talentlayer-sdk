import axios from "axios";
import { DEFAULT_SIGNATURE_VALUE } from "../constants";

export const getSignature = async (method: string, args: Record<string, any>, signatureUrl?: string): Promise<any> => {
    if (!signatureUrl) {
        return DEFAULT_SIGNATURE_VALUE;
    }

    const res = await axios.post(signatureUrl, {
        method,
        args,
    });

    return JSON.parse(res.data.result);
}
