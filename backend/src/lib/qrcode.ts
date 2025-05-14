import QRCode from "qrcode";

export async function generateQRCodeUrl(link: string): Promise<string> {
  return await QRCode.toDataURL(link);
}
