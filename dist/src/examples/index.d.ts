export declare const examples: {
    shoebox: {
        meta: {
            version: string;
            name: string;
            timestamp: string;
        };
        containers: ({
            kind: string;
            visible: boolean;
            acousticMaterial: {
                tags: string[];
                manufacturer: string;
                name: string;
                material: string;
                absorption: {
                    "63": number;
                    "125": number;
                    "250": number;
                    "500": number;
                    "1000": number;
                    "2000": number;
                    "4000": number;
                    "8000": number;
                };
                nrc: number;
                source: string;
                description: string;
                uuid: string;
            };
            geometry: {
                metadata: {
                    version: number;
                    type: string;
                    generator: string;
                };
                uuid: string;
                type: string;
                name: string;
                data: {
                    attributes: {
                        position: {
                            itemSize: number;
                            type: string;
                            array: number[];
                            normalized: boolean;
                        };
                        normals: {
                            itemSize: number;
                            type: string;
                            array: number[];
                            normalized: boolean;
                        };
                        texCoords: {
                            itemSize: number;
                            type: string;
                            array: number[];
                            normalized: boolean;
                        };
                    };
                    boundingSphere: {
                        center: number[];
                        radius: number;
                    };
                };
            };
            displayVertexNormals: boolean;
            fillSurface: boolean;
            wireframeVisible: boolean;
            edgesVisible: boolean;
            name: string;
            position: number[];
            rotation: number[];
            scale: number[];
            uuid: string;
            surfaces?: undefined;
            units?: undefined;
            originalFileData?: undefined;
            originalFileName?: undefined;
            color?: undefined;
        } | {
            surfaces: {
                kind: string;
                visible: boolean;
                acousticMaterial: {
                    tags: string[];
                    manufacturer: string;
                    name: string;
                    material: string;
                    absorption: {
                        "63": number;
                        "125": number;
                        "250": number;
                        "500": number;
                        "1000": number;
                        "2000": number;
                        "4000": number;
                        "8000": number;
                    };
                    nrc: number;
                    source: string;
                    description: string;
                    uuid: string;
                };
                geometry: {
                    metadata: {
                        version: number;
                        type: string;
                        generator: string;
                    };
                    uuid: string;
                    type: string;
                    name: string;
                    data: {
                        attributes: {
                            position: {
                                itemSize: number;
                                type: string;
                                array: number[];
                                normalized: boolean;
                            };
                            normals: {
                                itemSize: number;
                                type: string;
                                array: number[];
                                normalized: boolean;
                            };
                            texCoords: {
                                itemSize: number;
                                type: string;
                                array: number[];
                                normalized: boolean;
                            };
                        };
                        boundingSphere: {
                            center: number[];
                            radius: number;
                        };
                    };
                };
                displayVertexNormals: boolean;
                fillSurface: boolean;
                wireframeVisible: boolean;
                edgesVisible: boolean;
                name: string;
                position: number[];
                rotation: number[];
                scale: number[];
                uuid: string;
            }[];
            kind: string;
            name: string;
            uuid: string;
            units: number;
            originalFileData: string;
            originalFileName: string;
            visible: boolean;
            position: number[];
            rotation: number[];
            scale: number[];
            acousticMaterial?: undefined;
            geometry?: undefined;
            displayVertexNormals?: undefined;
            fillSurface?: undefined;
            wireframeVisible?: undefined;
            edgesVisible?: undefined;
            color?: undefined;
        } | {
            kind: string;
            name: string;
            visible: boolean;
            position: number[];
            scale: number[];
            rotation: (string | number)[];
            color: number;
            uuid: string;
            acousticMaterial?: undefined;
            geometry?: undefined;
            displayVertexNormals?: undefined;
            fillSurface?: undefined;
            wireframeVisible?: undefined;
            edgesVisible?: undefined;
            surfaces?: undefined;
            units?: undefined;
            originalFileData?: undefined;
            originalFileName?: undefined;
        })[];
        solvers: {
            name: string;
            kind: string;
            uuid: string;
            roomID: string;
            sourceIDs: string[];
            surfaceIDs: string[];
            receiverIDs: string[];
            updateInterval: number;
            passes: number;
            pointSize: number;
            reflectionOrder: number;
            runningWithoutReceivers: boolean;
            raysVisible: boolean;
            pointsVisible: boolean;
            invertedDrawStyle: boolean;
            plotStyle: {
                mode: string;
            };
            paths: {};
        }[];
    };
    concord: {
        meta: {
            version: string;
            name: string;
            timestamp: string;
        };
        containers: ({
            kind: string;
            visible: boolean;
            acousticMaterial: {
                tags: string[];
                manufacturer: string;
                name: string;
                material: string;
                absorption: {
                    "63": number;
                    "125": number;
                    "250": number;
                    "500": number;
                    "1000": number;
                    "2000": number;
                    "4000": number;
                    "8000": number;
                };
                nrc: number;
                source: string;
                description: string;
                uuid: string;
            };
            geometry: {
                metadata: {
                    version: number;
                    type: string;
                    generator: string;
                };
                uuid: string;
                type: string;
                name: string;
                data: {
                    attributes: {
                        position: {
                            itemSize: number;
                            type: string;
                            array: number[];
                            normalized: boolean;
                        };
                        normals: {
                            itemSize: number;
                            type: string;
                            array: number[];
                            normalized: boolean;
                        };
                        texCoords: {
                            itemSize: number;
                            type: string;
                            array: never[];
                            normalized: boolean;
                        };
                    };
                    boundingSphere: {
                        center: number[];
                        radius: number;
                    };
                };
            };
            displayVertexNormals: boolean;
            fillSurface: boolean;
            wireframeVisible: boolean;
            edgesVisible: boolean;
            name: string;
            position: number[];
            rotation: number[];
            scale: number[];
            uuid: string;
            surfaces?: undefined;
            units?: undefined;
            originalFileData?: undefined;
            originalFileName?: undefined;
            color?: undefined;
        } | {
            surfaces: {
                kind: string;
                visible: boolean;
                acousticMaterial: {
                    tags: string[];
                    manufacturer: string;
                    name: string;
                    material: string;
                    absorption: {
                        "63": number;
                        "125": number;
                        "250": number;
                        "500": number;
                        "1000": number;
                        "2000": number;
                        "4000": number;
                        "8000": number;
                    };
                    nrc: number;
                    source: string;
                    description: string;
                    uuid: string;
                };
                geometry: {
                    metadata: {
                        version: number;
                        type: string;
                        generator: string;
                    };
                    uuid: string;
                    type: string;
                    name: string;
                    data: {
                        attributes: {
                            position: {
                                itemSize: number;
                                type: string;
                                array: number[];
                                normalized: boolean;
                            };
                            normals: {
                                itemSize: number;
                                type: string;
                                array: number[];
                                normalized: boolean;
                            };
                            texCoords: {
                                itemSize: number;
                                type: string;
                                array: never[];
                                normalized: boolean;
                            };
                        };
                        boundingSphere: {
                            center: number[];
                            radius: number;
                        };
                    };
                };
                displayVertexNormals: boolean;
                fillSurface: boolean;
                wireframeVisible: boolean;
                edgesVisible: boolean;
                name: string;
                position: number[];
                rotation: number[];
                scale: number[];
                uuid: string;
            }[];
            kind: string;
            name: string;
            uuid: string;
            units: number;
            originalFileData: string;
            originalFileName: string;
            visible: boolean;
            position: number[];
            rotation: number[];
            scale: number[];
            acousticMaterial?: undefined;
            geometry?: undefined;
            displayVertexNormals?: undefined;
            fillSurface?: undefined;
            wireframeVisible?: undefined;
            edgesVisible?: undefined;
            color?: undefined;
        } | {
            kind: string;
            name: string;
            visible: boolean;
            position: number[];
            scale: number[];
            rotation: (string | number)[];
            color: number;
            uuid: string;
            acousticMaterial?: undefined;
            geometry?: undefined;
            displayVertexNormals?: undefined;
            fillSurface?: undefined;
            wireframeVisible?: undefined;
            edgesVisible?: undefined;
            surfaces?: undefined;
            units?: undefined;
            originalFileData?: undefined;
            originalFileName?: undefined;
        })[];
        solvers: {
            name: string;
            kind: string;
            uuid: string;
            roomID: string;
            sourceIDs: string[];
            surfaceIDs: string[];
            receiverIDs: string[];
            updateInterval: number;
            passes: number;
            pointSize: number;
            reflectionOrder: number;
            runningWithoutReceivers: boolean;
            raysVisible: boolean;
            pointsVisible: boolean;
            invertedDrawStyle: boolean;
            plotStyle: {
                mode: string;
            };
            paths: {};
        }[];
    };
    auditorium: {
        meta: {
            version: string;
            name: string;
            timestamp: string;
        };
        containers: ({
            kind: string;
            visible: boolean;
            acousticMaterial: {
                tags: string[];
                manufacturer: string;
                name: string;
                material: string;
                absorption: {
                    "63": number;
                    "125": number;
                    "250": number;
                    "500": number;
                    "1000": number;
                    "2000": number;
                    "4000": number;
                    "8000": number;
                };
                nrc: number;
                source: string;
                description: string;
                uuid: string;
            };
            geometry: {
                metadata: {
                    version: number;
                    type: string;
                    generator: string;
                };
                uuid: string;
                type: string;
                name: string;
                data: {
                    attributes: {
                        position: {
                            itemSize: number;
                            type: string;
                            array: number[];
                            normalized: boolean;
                        };
                        normals: {
                            itemSize: number;
                            type: string;
                            array: number[];
                            normalized: boolean;
                        };
                    };
                    boundingSphere: {
                        center: number[];
                        radius: number;
                    };
                };
            };
            displayVertexNormals: boolean;
            fillSurface: boolean;
            wireframeVisible: boolean;
            edgesVisible: boolean;
            name: string;
            position: number[];
            rotation: number[];
            scale: number[];
            uuid: string;
            surfaces?: undefined;
            units?: undefined;
            originalFileData?: undefined;
            originalFileName?: undefined;
        } | {
            surfaces: {
                kind: string;
                visible: boolean;
                name: string;
                position: number[];
                rotation: number[];
                scale: number[];
                uuid: string;
                children: {
                    kind: string;
                    visible: boolean;
                    acousticMaterial: {
                        tags: string[];
                        manufacturer: string;
                        name: string;
                        material: string;
                        absorption: {
                            "63": number;
                            "125": number;
                            "250": number;
                            "500": number;
                            "1000": number;
                            "2000": number;
                            "4000": number;
                            "8000": number;
                        };
                        nrc: number;
                        source: string;
                        description: string;
                        uuid: string;
                    };
                    geometry: {
                        metadata: {
                            version: number;
                            type: string;
                            generator: string;
                        };
                        uuid: string;
                        type: string;
                        name: string;
                        data: {
                            attributes: {
                                position: {
                                    itemSize: number;
                                    type: string;
                                    array: number[];
                                    normalized: boolean;
                                };
                                normals: {
                                    itemSize: number;
                                    type: string;
                                    array: number[];
                                    normalized: boolean;
                                };
                            };
                            boundingSphere: {
                                center: number[];
                                radius: number;
                            };
                        };
                    };
                    displayVertexNormals: boolean;
                    fillSurface: boolean;
                    wireframeVisible: boolean;
                    edgesVisible: boolean;
                    name: string;
                    position: number[];
                    rotation: number[];
                    scale: number[];
                    uuid: string;
                }[];
            }[];
            kind: string;
            name: string;
            uuid: string;
            units: number;
            originalFileData: string;
            originalFileName: string;
            visible: boolean;
            position: number[];
            rotation: number[];
            scale: number[];
            acousticMaterial?: undefined;
            geometry?: undefined;
            displayVertexNormals?: undefined;
            fillSurface?: undefined;
            wireframeVisible?: undefined;
            edgesVisible?: undefined;
        })[];
        solvers: never[];
    };
};
export default examples;
export type Example = keyof typeof examples;
