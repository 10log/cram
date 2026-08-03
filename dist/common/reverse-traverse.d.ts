type EndCondition = (element: HTMLElement | null) => boolean | null;
export declare function reverseTraverse(endCondition: EndCondition): (startElement: HTMLElement) => (HTMLElement | null);
export default reverseTraverse;
