export declare class OBJLoader {
    private fileContents;
    private defaultModelName;
    private currentMaterial;
    private currentGroup;
    private smoothingGroup;
    private result;
    constructor(fileContents: string, defaultModelName?: string);
    parseAsync(): Promise<IResult>;
    parse(): IResult;
    private currentModel;
    private parseObject;
    private parseGroup;
    private parseVertexCoords;
    private parseTextureCoords;
    private parseVertexNormal;
    private parsePolygon;
    private parseMtlLib;
    private parseUseMtl;
    private parseSmoothShadingStatement;
}
interface IResult {
    models: IModel[];
    materialLibraries: string[];
}
interface IModel {
    name: string;
    vertices: IVertex[];
    textureCoords: ITextureVertex[];
    vertexNormals: IVertex[];
    faces: IFace[];
}
interface IFace {
    material: string;
    group: string;
    smoothingGroup: number;
    vertices: IFaceVertexIndicies[];
}
interface IFaceVertexIndicies {
    vertexIndex: number;
    textureCoordsIndex: number;
    vertexNormalIndex: number;
}
interface IVertex {
    x: number;
    y: number;
    z: number;
}
interface ITextureVertex {
    u: number;
    v: number;
    w: number;
}
export {};
