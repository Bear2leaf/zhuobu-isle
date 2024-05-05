/*
 * From http://www.redblobgames.com/maps/mapgen2/
 * Copyright 2017 Red Blob Games <redblobgames@gmail.com>
 * License: Apache v2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>
 */

'use strict';

import TriangleMesh from "./TriangleMesh";

/**
 * Find regions adjacent to rivers; out_r should be a Set
 */
export function find_riverbanks_r(out_r: Set<number>, mesh: TriangleMesh, s_flow: number[]) {
    for (let s = 0; s < mesh.numSolidSides; s++) {
        if (s_flow[s] > 0) {
            out_r.add(mesh.s_begin_r(s));
            out_r.add(mesh.s_end_r(s));
        }
    }
};


/**
 * Find lakeshores -- regions adjacent to lakes; out_r should be a Set
 */
export function find_lakeshores_r(out_r: Set<number>, mesh: TriangleMesh, r_ocean: boolean[], r_water: boolean[]) {
    for (let s = 0; s < mesh.numSolidSides; s++) {
        let r0 = mesh.s_begin_r(s),
            r1 = mesh.s_end_r(s);
        if (r_water[r0] && !r_ocean[r0]) {
            out_r.add(r0);
            out_r.add(r1);
        }
    }
};


/**
 * Find regions that have maximum moisture; returns a Set
 */
export function find_moisture_seeds_r(mesh: TriangleMesh, s_flow: number[], r_ocean: boolean[], r_water: boolean[]) {
    let seeds_r = new Set<number>();
    find_riverbanks_r(seeds_r, mesh, s_flow);
    find_lakeshores_r(seeds_r, mesh, r_ocean, r_water);
    return seeds_r;
};


/**
 * Assign moisture level. Oceans and lakes have moisture 1.0. Land
 * regions have moisture based on the distance to the nearest fresh
 * water. Lakeshores and riverbanks are distance 0. Moisture will be
 * 1.0 at distance 0 and go down to 0.0 at the maximum distance.
 */
export function assign_r_moisture(
    r_moisture: number[], r_waterdistance: (number | null)[],
    mesh: TriangleMesh,
    r_water: boolean[], seed_r: Set<number> /* Set */
) {
    r_waterdistance.length = mesh.numRegions;
    r_moisture.length = mesh.numRegions;
    r_waterdistance.fill(null);

    let out_r: Array<number> = [];
    let queue_r = Array.from(seed_r);
    let maxDistance = 1;
    queue_r.forEach((r) => { r_waterdistance[r] = 0; });
    while (queue_r.length > 0) {
        let current_r = queue_r.shift();
        if (current_r === undefined) {
            throw new Error("current_r is undefined");
        }
        mesh.r_circulate_r(out_r, current_r);
        for (let neighbor_r of out_r) {
            if (!r_water[neighbor_r] && r_waterdistance[neighbor_r] === null) {
                const waterDistance = r_waterdistance[current_r];
                if (waterDistance === null) {
                    throw new Error("waterDistance is undefined");
                }
                let newDistance = 1 + waterDistance;
                r_waterdistance[neighbor_r] = newDistance;
                if (newDistance > maxDistance) { maxDistance = newDistance; }
                queue_r.push(neighbor_r);
            }
        }
    }

    r_waterdistance.forEach((d, r) => {
        const water = r_water[r];
        if (water) {
            r_moisture[r] = 1.0;
        } else {
            r_moisture[r] = 1.0 - Math.pow((d || 0) / maxDistance, 0.5);
        }
    });
};


/**
 * Redistribute moisture values evenly so that all moistures
 * from min_moisture to max_moisture are equally represented.
 */
export function redistribute_r_moisture(r_moisture: number[], mesh: TriangleMesh, r_water: boolean[], min_moisture: number, max_moisture: number) {
    let land_r = [];
    for (let r = 0; r < mesh.numSolidRegions; r++) {
        if (!r_water[r]) {
            land_r.push(r);
        }
    }

    land_r.sort((r1, r2) => r_moisture[r1] - r_moisture[r2]);

    for (let i = 0; i < land_r.length; i++) {
        r_moisture[land_r[i]] = min_moisture + (max_moisture - min_moisture) * i / (land_r.length - 1);
    }
};
