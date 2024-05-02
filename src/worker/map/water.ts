// From http://www.redblobgames.com/maps/mapgen2/
// Copyright 2017 Red Blob Games <redblobgames@gmail.com>
// License: Apache v2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>

'use strict';
import TriangleMesh from './TriangleMesh';
import { NoiseFunction2D } from '../util/simplex-noise';
import { mix } from '../util/math';


/**
 * Add several noise values together
 */
export function fbm_noise(noise: {noise2D: NoiseFunction2D}, amplitudes: number[], nx: number, ny: number) {
    let sum = 0, sumOfAmplitudes = 0;
    for (let octave = 0; octave < amplitudes.length; octave++) {
        let frequency = 1 << octave;
        sum += amplitudes[octave] * noise.noise2D(nx * frequency, ny * frequency/*, octave*/);
        sumOfAmplitudes += amplitudes[octave];
    }
    return sum / sumOfAmplitudes;
};
// NOTE: r_water, r_ocean, other fields are boolean valued so it
// could be more efficient to pack them as bit fields in Uint8Array

/* a region is water if the noise value is low */
export function assign_r_water(r_water: boolean[], mesh: TriangleMesh, noise: {noise2D: NoiseFunction2D}, params: {
    amplitudes: number[],
    round: number,
    inflate: number
}) {
    r_water.length = mesh.numRegions;
    for (let r = 0; r < mesh.numRegions; r++) {
        if (mesh.r_ghost(r) || mesh.r_boundary(r)) {
            r_water[r] = true;
        } else {
            let nx = (mesh.r_x(r) - 500) / 500;
            let ny = (mesh.r_y(r) - 500) / 500;
            let distance = Math.max(Math.abs(nx), Math.abs(ny));
            let n = fbm_noise(noise, params.amplitudes, nx, ny);
            n = mix(n, 0.5, params.round);
            r_water[r] = n - (1.0 - params.inflate) * distance * distance < 0;
        }
    }
    return r_water;
}


/* a region is ocean if it is a water region connected to the ghost region,
   which is outside the boundary of the map; this could be any seed set but
   for islands, the ghost region is a good seed */
export function assign_r_ocean(r_ocean: boolean[], mesh: TriangleMesh, r_water: boolean[]) {
    r_ocean.length = mesh.numRegions;
    r_ocean.fill(false);
    let stack = [mesh.ghost_r()];
    let r_out: number[] = [];
    while (stack.length > 0) {
        let r1 = stack.pop();
        if (r1 === undefined) {
            throw new Error("r1 is undefined");
        }
        mesh.r_circulate_r(r_out, r1);
        for (let r2 of r_out) {
            if (r_water[r2] && !r_ocean[r2]) {
                r_ocean[r2] = true;
                stack.push(r2);
            }
        }
    }
    return r_ocean;
}
