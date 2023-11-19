import axios from "axios";
import { DEFAULT_SIGNATURE_VALUE } from "../../constants";
import { getSignature } from "../signature";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getSignature', () => {
    it('should return default signature value when no signature API url is provided', async () => {
        const response = await getSignature('post', []);
        expect(response).toEqual(DEFAULT_SIGNATURE_VALUE);
    });

    it('should call signature api url when provided with the method', async () => {
        const signatureApiUrl = 'http://www.example.com';
        const method = 'post';
        const args = { test: "data" };

        // Mock axios.post specifically
        mockedAxios.post.mockResolvedValueOnce({ data: { result: JSON.stringify({ foo: 'bar' }) } });

        const response = await getSignature(method, args, signatureApiUrl);

        expect(axios.post).toHaveBeenCalledWith(signatureApiUrl, { method, args });
        expect(response).toEqual({ foo: 'bar' });
    });
});