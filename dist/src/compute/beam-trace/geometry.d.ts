import { Polygon3D } from 'beam-trace';
import { default as Room } from '../../objects/room';
import { default as Surface } from '../../objects/surface';
import { default as Source } from '../../objects/source';
export declare function surfaceToPolygons(surface: Surface): Polygon3D[];
export declare function extractPolygons(room: Room | undefined): {
    polygons: Polygon3D[];
    surfaceToPolygonIndex: Map<string, number[]>;
    polygonToSurface: Map<number, Surface>;
};
export declare function currentTreeSignature(params: {
    source: Source | undefined;
    room: Room | undefined;
    roomID: string;
    maxOrder: number;
}): string | null;
