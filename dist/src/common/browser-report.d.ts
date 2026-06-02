export interface Browser {
    name: string;
    version: string;
}
export interface Flash {
    version: any;
}
export interface Java {
    version: any;
}
export interface Os {
    name: string;
    version: string;
}
export interface Screen {
    colors: number;
    dppx: number;
    height: number;
    width: number;
}
export interface Layout {
    height: number;
    width: number;
}
export interface Viewport {
    height: number;
    layout: Layout;
    width: number;
    zoom: number;
}
export interface Report {
    browser: Browser;
    cookies: boolean;
    flash: Flash;
    ip: any;
    java: Java;
    os: Os;
    screen: Screen;
    scripts: boolean;
    userAgent: string;
    viewport: Viewport;
    websockets: boolean;
    lang: string[];
    timestamp: string;
}
export default function browerReport(userAgent?: string): Report;
