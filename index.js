/*
 * QrEncoder Javascript library for QrCode generation
 *
 * Copyright 2015, Vincent Pellé
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 * 
 *	pelle.vincent@gmail.com
 *	
 * Includes Javascript QR Encoder
 * Copyright 2010, tz@execpc.com, released under GPLv3
 *
 * Last modified: Tue Sep 29 22:41:45 MET DST 1998 
 */
'use strict';

var CONSTANTS = {
		adelta : [  // alignment pattern
	  		0, 11, 15, 19, 23, 27, 31, // force 1 pat
	  		16, 18, 20, 22, 24, 26, 28, 20, 22, 24, 24, 26, 28, 28, 22, 24, 24,
	  		26, 26, 28, 28, 24, 24, 26, 26, 26, 28, 28, 24, 26, 26, 26, 28, 28
	  	],
		 vpat : [  // version block
	    	0xc94, 0x5bc, 0xa99, 0x4d3, 0xbf6, 0x762, 0x847, 0x60d,
	    	0x928, 0xb78, 0x45d, 0xa17, 0x532, 0x9a6, 0x683, 0x8c9,
	    	0x7ec, 0xec4, 0x1e1, 0xfab, 0x08e, 0xc1a, 0x33f, 0xd75,
	    	0x250, 0x9d5, 0x6f0, 0x8ba, 0x79f, 0xb0b, 0x42e, 0xa64,
	    	0x541, 0xc69
		],
		fmtword : [  // final format bits with mask: level << 3 | mask
	    	0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976,    // L
	    	0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0,    // M
	    	0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed,    // Q
	    	0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b    // H
		],
		eccblocks : [  // 4 per version: number of blocks 1,2; data width; ecc width
	    1, 0, 19, 7, 1, 0, 16, 10, 1, 0, 13, 13, 1, 0, 9, 17,
	    1, 0, 34, 10, 1, 0, 28, 16, 1, 0, 22, 22, 1, 0, 16, 28,
	    1, 0, 55, 15, 1, 0, 44, 26, 2, 0, 17, 18, 2, 0, 13, 22,
	    1, 0, 80, 20, 2, 0, 32, 18, 2, 0, 24, 26, 4, 0, 9, 16,
	    1, 0, 108, 26, 2, 0, 43, 24, 2, 2, 15, 18, 2, 2, 11, 22,
	    2, 0, 68, 18, 4, 0, 27, 16, 4, 0, 19, 24, 4, 0, 15, 28,
	    2, 0, 78, 20, 4, 0, 31, 18, 2, 4, 14, 18, 4, 1, 13, 26,
	    2, 0, 97, 24, 2, 2, 38, 22, 4, 2, 18, 22, 4, 2, 14, 26,
	    2, 0, 116, 30, 3, 2, 36, 22, 4, 4, 16, 20, 4, 4, 12, 24,
	    2, 2, 68, 18, 4, 1, 43, 26, 6, 2, 19, 24, 6, 2, 15, 28,
	    4, 0, 81, 20, 1, 4, 50, 30, 4, 4, 22, 28, 3, 8, 12, 24,
	    2, 2, 92, 24, 6, 2, 36, 22, 4, 6, 20, 26, 7, 4, 14, 28,
	    4, 0, 107, 26, 8, 1, 37, 22, 8, 4, 20, 24, 12, 4, 11, 22,
	    3, 1, 115, 30, 4, 5, 40, 24, 11, 5, 16, 20, 11, 5, 12, 24,
	    5, 1, 87, 22, 5, 5, 41, 24, 5, 7, 24, 30, 11, 7, 12, 24,
	    5, 1, 98, 24, 7, 3, 45, 28, 15, 2, 19, 24, 3, 13, 15, 30,
	    1, 5, 107, 28, 10, 1, 46, 28, 1, 15, 22, 28, 2, 17, 14, 28,
	    5, 1, 120, 30, 9, 4, 43, 26, 17, 1, 22, 28, 2, 19, 14, 28,
	    3, 4, 113, 28, 3, 11, 44, 26, 17, 4, 21, 26, 9, 16, 13, 26,
	    3, 5, 107, 28, 3, 13, 41, 26, 15, 5, 24, 30, 15, 10, 15, 28,
	    4, 4, 116, 28, 17, 0, 42, 26, 17, 6, 22, 28, 19, 6, 16, 30,
	    2, 7, 111, 28, 17, 0, 46, 28, 7, 16, 24, 30, 34, 0, 13, 24,
	    4, 5, 121, 30, 4, 14, 47, 28, 11, 14, 24, 30, 16, 14, 15, 30,
	    6, 4, 117, 30, 6, 14, 45, 28, 11, 16, 24, 30, 30, 2, 16, 30,
	    8, 4, 106, 26, 8, 13, 47, 28, 7, 22, 24, 30, 22, 13, 15, 30,
	    10, 2, 114, 28, 19, 4, 46, 28, 28, 6, 22, 28, 33, 4, 16, 30,
	    8, 4, 122, 30, 22, 3, 45, 28, 8, 26, 23, 30, 12, 28, 15, 30,
	    3, 10, 117, 30, 3, 23, 45, 28, 4, 31, 24, 30, 11, 31, 15, 30,
	    7, 7, 116, 30, 21, 7, 45, 28, 1, 37, 23, 30, 19, 26, 15, 30,
	    5, 10, 115, 30, 19, 10, 47, 28, 15, 25, 24, 30, 23, 25, 15, 30,
	    13, 3, 115, 30, 2, 29, 46, 28, 42, 1, 24, 30, 23, 28, 15, 30,
	    17, 0, 115, 30, 10, 23, 46, 28, 10, 35, 24, 30, 19, 35, 15, 30,
	    17, 1, 115, 30, 14, 21, 46, 28, 29, 19, 24, 30, 11, 46, 15, 30,
	    13, 6, 115, 30, 14, 23, 46, 28, 44, 7, 24, 30, 59, 1, 16, 30,
	    12, 7, 121, 30, 12, 26, 47, 28, 39, 14, 24, 30, 22, 41, 15, 30,
	    6, 14, 121, 30, 6, 34, 47, 28, 46, 10, 24, 30, 2, 64, 15, 30,
	    17, 4, 122, 30, 29, 14, 46, 28, 49, 10, 24, 30, 24, 46, 15, 30,
	    4, 18, 122, 30, 13, 32, 46, 28, 48, 14, 24, 30, 42, 32, 15, 30,
	    20, 4, 117, 30, 40, 7, 47, 28, 43, 22, 24, 30, 10, 67, 15, 30,
	    19, 6, 118, 30, 18, 31, 47, 28, 34, 34, 24, 30, 20, 61, 15, 30
	],
	glog : [ // Galois field log table
	    0xff, 0x00, 0x01, 0x19, 0x02, 0x32, 0x1a, 0xc6, 0x03, 0xdf, 0x33, 0xee, 0x1b, 0x68, 0xc7, 0x4b,
	    0x04, 0x64, 0xe0, 0x0e, 0x34, 0x8d, 0xef, 0x81, 0x1c, 0xc1, 0x69, 0xf8, 0xc8, 0x08, 0x4c, 0x71,
	    0x05, 0x8a, 0x65, 0x2f, 0xe1, 0x24, 0x0f, 0x21, 0x35, 0x93, 0x8e, 0xda, 0xf0, 0x12, 0x82, 0x45,
	    0x1d, 0xb5, 0xc2, 0x7d, 0x6a, 0x27, 0xf9, 0xb9, 0xc9, 0x9a, 0x09, 0x78, 0x4d, 0xe4, 0x72, 0xa6,
	    0x06, 0xbf, 0x8b, 0x62, 0x66, 0xdd, 0x30, 0xfd, 0xe2, 0x98, 0x25, 0xb3, 0x10, 0x91, 0x22, 0x88,
	    0x36, 0xd0, 0x94, 0xce, 0x8f, 0x96, 0xdb, 0xbd, 0xf1, 0xd2, 0x13, 0x5c, 0x83, 0x38, 0x46, 0x40,
	    0x1e, 0x42, 0xb6, 0xa3, 0xc3, 0x48, 0x7e, 0x6e, 0x6b, 0x3a, 0x28, 0x54, 0xfa, 0x85, 0xba, 0x3d,
	    0xca, 0x5e, 0x9b, 0x9f, 0x0a, 0x15, 0x79, 0x2b, 0x4e, 0xd4, 0xe5, 0xac, 0x73, 0xf3, 0xa7, 0x57,
	    0x07, 0x70, 0xc0, 0xf7, 0x8c, 0x80, 0x63, 0x0d, 0x67, 0x4a, 0xde, 0xed, 0x31, 0xc5, 0xfe, 0x18,
	    0xe3, 0xa5, 0x99, 0x77, 0x26, 0xb8, 0xb4, 0x7c, 0x11, 0x44, 0x92, 0xd9, 0x23, 0x20, 0x89, 0x2e,
	    0x37, 0x3f, 0xd1, 0x5b, 0x95, 0xbc, 0xcf, 0xcd, 0x90, 0x87, 0x97, 0xb2, 0xdc, 0xfc, 0xbe, 0x61,
	    0xf2, 0x56, 0xd3, 0xab, 0x14, 0x2a, 0x5d, 0x9e, 0x84, 0x3c, 0x39, 0x53, 0x47, 0x6d, 0x41, 0xa2,
	    0x1f, 0x2d, 0x43, 0xd8, 0xb7, 0x7b, 0xa4, 0x76, 0xc4, 0x17, 0x49, 0xec, 0x7f, 0x0c, 0x6f, 0xf6,
	    0x6c, 0xa1, 0x3b, 0x52, 0x29, 0x9d, 0x55, 0xaa, 0xfb, 0x60, 0x86, 0xb1, 0xbb, 0xcc, 0x3e, 0x5a,
	    0xcb, 0x59, 0x5f, 0xb0, 0x9c, 0xa9, 0xa0, 0x51, 0x0b, 0xf5, 0x16, 0xeb, 0x7a, 0x75, 0x2c, 0xd7,
	    0x4f, 0xae, 0xd5, 0xe9, 0xe6, 0xe7, 0xad, 0xe8, 0x74, 0xd6, 0xf4, 0xea, 0xa8, 0x50, 0x58, 0xaf
	],
	gexp : [ // Galios field exponent table
	    0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1d, 0x3a, 0x74, 0xe8, 0xcd, 0x87, 0x13, 0x26,
	    0x4c, 0x98, 0x2d, 0x5a, 0xb4, 0x75, 0xea, 0xc9, 0x8f, 0x03, 0x06, 0x0c, 0x18, 0x30, 0x60, 0xc0,
	    0x9d, 0x27, 0x4e, 0x9c, 0x25, 0x4a, 0x94, 0x35, 0x6a, 0xd4, 0xb5, 0x77, 0xee, 0xc1, 0x9f, 0x23,
	    0x46, 0x8c, 0x05, 0x0a, 0x14, 0x28, 0x50, 0xa0, 0x5d, 0xba, 0x69, 0xd2, 0xb9, 0x6f, 0xde, 0xa1,
	    0x5f, 0xbe, 0x61, 0xc2, 0x99, 0x2f, 0x5e, 0xbc, 0x65, 0xca, 0x89, 0x0f, 0x1e, 0x3c, 0x78, 0xf0,
	    0xfd, 0xe7, 0xd3, 0xbb, 0x6b, 0xd6, 0xb1, 0x7f, 0xfe, 0xe1, 0xdf, 0xa3, 0x5b, 0xb6, 0x71, 0xe2,
	    0xd9, 0xaf, 0x43, 0x86, 0x11, 0x22, 0x44, 0x88, 0x0d, 0x1a, 0x34, 0x68, 0xd0, 0xbd, 0x67, 0xce,
	    0x81, 0x1f, 0x3e, 0x7c, 0xf8, 0xed, 0xc7, 0x93, 0x3b, 0x76, 0xec, 0xc5, 0x97, 0x33, 0x66, 0xcc,
	    0x85, 0x17, 0x2e, 0x5c, 0xb8, 0x6d, 0xda, 0xa9, 0x4f, 0x9e, 0x21, 0x42, 0x84, 0x15, 0x2a, 0x54,
	    0xa8, 0x4d, 0x9a, 0x29, 0x52, 0xa4, 0x55, 0xaa, 0x49, 0x92, 0x39, 0x72, 0xe4, 0xd5, 0xb7, 0x73,
	    0xe6, 0xd1, 0xbf, 0x63, 0xc6, 0x91, 0x3f, 0x7e, 0xfc, 0xe5, 0xd7, 0xb3, 0x7b, 0xf6, 0xf1, 0xff,
	    0xe3, 0xdb, 0xab, 0x4b, 0x96, 0x31, 0x62, 0xc4, 0x95, 0x37, 0x6e, 0xdc, 0xa5, 0x57, 0xae, 0x41,
	    0x82, 0x19, 0x32, 0x64, 0xc8, 0x8d, 0x07, 0x0e, 0x1c, 0x38, 0x70, 0xe0, 0xdd, 0xa7, 0x53, 0xa6,
	    0x51, 0xa2, 0x59, 0xb2, 0x79, 0xf2, 0xf9, 0xef, 0xc3, 0x9b, 0x2b, 0x56, 0xac, 0x45, 0x8a, 0x09,
	    0x12, 0x24, 0x48, 0x90, 0x3d, 0x7a, 0xf4, 0xf5, 0xf7, 0xf3, 0xfb, 0xeb, 0xcb, 0x8b, 0x0b, 0x16,
	    0x2c, 0x58, 0xb0, 0x7d, 0xfa, 0xe9, 0xcf, 0x83, 0x1b, 0x36, 0x6c, 0xd8, 0xad, 0x47, 0x8e, 0x00
	],
	badcoeff : [3, 3, 40, 10]
};


class QrEncoder {

    constructor() {
	this._strinbuf = []; // data input
	this._eccbuf = []; // ecc append
	this._qrframe = []; // image working buffer
	this._framask = []; // fixed part of image
	this._rlens = []; // run lengths for badness
	this._genpoly = [];
    }


    /**
     * Getters/Setters
     */

    get strinbuf() { return  this._strinbuf; }
    get eccbuf() { return  this._eccbuf; }
    get qrframe() { return  this._qrframe; }
    get framask() { return  this._framask; }
    get rlens() { return  this._rlens; }
    get genpoly() { return  this._genpoly; }

    get ecclevel() { return  this._ecclevel; }
    get width() { return this._width; } // Control value based on version

    set strinbuf(newStrinbuf) { this._strinbuf = newStrinbuf; }
    set eccbuf(newEccbuf) {  this._eccbuf = newEccbuf; }
    set qrframe(newQrframe) { this._qrframe = newQrframe; }
    set framask(newFramask) { this._framask = newFramask; }
    set rlens(newRlens) { this._rlens = newRlens; }
    set genpoly(newGenpoly) { this._genpoly = newGenpoly; }

    set ecclevel(newEcclevel) { this._ecclevel = newEcclevel; }
    set width(newWidth) { this._width = newWidth; }

    /**
     * pseudo private methods
     */

    // set bit to indicate cell in qrframe is immutable. symetric around diagonal
    _setmask (x, y) {
	var bt;
	if (x > y) {
	    bt = x;
	    x = y;
	    y = bt;
	}
	// y*y = 1+3+5...
	bt = y;
	bt *= y;
	bt += y;
	bt >>= 1;
	bt += x;
	this.framask[bt] = 1;
    }


    // enter alignment pattern - black to qrframe, white to mask (later black frame
    // merged to mask)
    _putalign (x, y) {
	var j;

	this.qrframe[x + this.width * y] = 1;
	for (j = -2; j < 2; j++) {
	    this.qrframe[(x + j) + this.width * (y - 2)] = 1;
	    this.qrframe[(x - 2) + this.width * (y + j + 1)] = 1;
	    this.qrframe[(x + 2) + this.width * (y + j)] = 1;
	    this.qrframe[(x + j + 1) + this.width * (y + 2)] = 1;
	}
	for (j = 0; j < 2; j++) {
	    this._setmask(x - 1, y + j);
	    this._setmask(x + 1, y - j);
	    this._setmask(x - j, y - 1);
	    this._setmask(x + j, y + 1);
	}
    }


    // Reed Solomon error correction
    // exponentiation mod N
    _modnn (x) {
	while (x >= 255) {
	    x -= 255;
	    x = (x >> 8) + (x & 255);
	}
	return x;
    }


    // Calculate and append ECC data to data block. Block is in strinbuf, indexes to
    // buffers given.
    _appendrs (data, dlen, ecbuf, eclen) {
	var i, j, fb;

	for (i = 0; i < eclen; i++)
	    this.strinbuf[ecbuf + i] = 0;
	for (i = 0; i < dlen; i++) {
	    fb = CONSTANTS["glog"][this.strinbuf[data + i] ^ this.strinbuf[ecbuf]];
	    if (fb != 255)     /* fb term is non-zero */
		for (j = 1; j < eclen; j++)
		    this.strinbuf[ecbuf + j - 1] = this.strinbuf[ecbuf + j] ^ CONSTANTS["gexp"][this._modnn(fb + this.genpoly[eclen - j])];
	    else
		for( j = ecbuf ; j < ecbuf + eclen; j++ )
		    this.strinbuf[j] = this.strinbuf[j + 1];
	    this.strinbuf[ ecbuf + eclen - 1] = fb == 255 ? 0 : CONSTANTS["gexp"][this._modnn(fb + this.genpoly[0])];
	}
    }


    // ========================================================================
    // Frame data insert following the path rules

    // check mask - since symmetrical use half.
    _ismasked (x, y) {
	var bt;
	if (x > y) {
	    bt = x;
	    x = y;
	    y = bt;
	}
	bt = y;
	bt += y * y;
	bt >>= 1;
	bt += x;
	return this.framask[bt];
    }


    // ========================================================================
    // Apply the selected mask out of the 8.
    _applymask (m) {
	var x, y, r3x, r3y;

	switch (m) {
	case 0:
	    for (y = 0; y < this.width; y++)
		for (x = 0; x < this.width; x++)
		    if (!((x + y) & 1) && !this._ismasked(x, y))
			this.qrframe[x + y * this.width] ^= 1;
	    break;
	case 1:
	    for (y = 0; y < this.width; y++)
		for (x = 0; x < this.width; x++)
		    if (!(y & 1) && !this._ismasked(x, y))
			this.qrframe[x + y * this.width] ^= 1;
	    break;
	case 2:
	    for (y = 0; y < this.width; y++)
		for (r3x = 0, x = 0; x < this.width; x++, r3x++) {
		    if (r3x == 3)
			r3x = 0;
		    if (!r3x && !this._ismasked(x, y))
			this.qrframe[x + y * this.width] ^= 1;
		}
	    break;
	case 3:
	    for (r3y = 0, y = 0; y < this.width; y++, r3y++) {
		if (r3y == 3)
		    r3y = 0;
		for (r3x = r3y, x = 0; x < this.width; x++, r3x++) {
		    if (r3x == 3)
			r3x = 0;
		    if (!r3x && !this._ismasked(x, y))
			this.qrframe[x + y * this.width] ^= 1;
		}
	    }
	    break;
	case 4:
	    for (y = 0; y < this.width; y++)
		for (r3x = 0, r3y = ((y >> 1) & 1), x = 0; x < this.width; x++, r3x++) {
		    if (r3x == 3) {
			r3x = 0;
			r3y = !r3y;
		    }
		    if (!r3y && !this._ismasked(x, y))
			this.qrframe[x + y * this.width] ^= 1;
		}
	    break;
	case 5:
	    for (r3y = 0, y = 0; y < this.width; y++, r3y++) {
		if (r3y == 3)
		    r3y = 0;
		for (r3x = 0, x = 0; x < this.width; x++, r3x++) {
		    if (r3x == 3)
			r3x = 0;
		    if (!((x & y & 1) + !(!r3x | !r3y)) && !this._ismasked(x, y))
			this.qrframe[x + y * this.width] ^= 1;
		}
	    }
	    break;
	case 6:
	    for (r3y = 0, y = 0; y < this.width; y++, r3y++) {
		if (r3y == 3)
		    r3y = 0;
		for (r3x = 0, x = 0; x < this.width; x++, r3x++) {
		    if (r3x == 3)
			r3x = 0;
		    if (!(((x & y & 1) + (r3x && (r3x == r3y))) & 1) && !this._ismasked(x, y))
			this.qrframe[x + y * this.width] ^= 1;
		}
	    }
	    break;
	case 7:
	    for (r3y = 0, y = 0; y < this.width; y++, r3y++) {
		if (r3y == 3)
		    r3y = 0;
		for (r3x = 0, x = 0; x < this.width; x++, r3x++) {
		    if (r3x == 3)
			r3x = 0;
		    if (!(((r3x && (r3x == r3y)) + ((x + y) & 1)) & 1) && !this._ismasked(x, y))
			this.qrframe[x + y * this.width] ^= 1;
		}
	    }
	    break;
	}
	return;
    }



    // Using the table of the length of each run, calculate the amount of bad image
    // - long runs or those that look like finders; called twice, once each for X
    // and Y
    _badruns (length) {
	var i,
	runsbad = 0;
	for (i = 0; i <= length; i++)
	    if (this.rlens[i] >= 5)
		runsbad += CONSTANTS["badcoeff"][0] + this.rlens[i] - 5;
	// BwBBBwB as in finder
	for (i = 3; i < length - 1; i += 2)
	    if (this.rlens[i - 2] == this.rlens[i + 2]
	    && this.rlens[i + 2] == this.rlens[i - 1]
	    && this.rlens[i - 1] == this.rlens[i + 1]
	    && this.rlens[i - 1] * 3 == this.rlens[i]
	    // white around the black pattern? Not part of spec
	    && (this.rlens[i - 3] == 0 // beginning
		    || i + 3 > length  // end
		    || this.rlens[i - 3] * 3 >= this.rlens[i] * 4 || this.rlens[i + 3] * 3 >= this.rlens[i] * 4)
	    )
		runsbad += CONSTANTS["badcoeff"][2];
	return runsbad;
    }

    // Calculate how bad the masked image is - blocks, imbalance, runs, or finders.
    _badcheck() {
	var x, y, h, b, b1,
	thisbad = 0,
	bw = 0;

	// blocks of same color.
	for (y = 0; y < this.width - 1; y++)
	    for (x = 0; x < this.width - 1; x++)
		if ((this.qrframe[x + this.width * y] && this.qrframe[(x + 1) + this.width * y]
		&& this.qrframe[x + this.width * (y + 1)] && this.qrframe[(x + 1) + this.width * (y + 1)]) // all
		// black
		|| !(this.qrframe[x + this.width * y] || this.qrframe[(x + 1) + this.width * y]
		|| this.qrframe[x + this.width * (y + 1)] || this.qrframe[(x + 1) + this.width * (y + 1)])) // all
		    // white
		    thisbad += CONSTANTS["badcoeff"][1];

	// X runs
	for (y = 0; y < this.width; y++) {
	    this.rlens[0] = 0;
	    for (h = b = x = 0; x < this.width; x++) {
		if ((b1 = this.qrframe[x + this.width * y]) == b)
		    this.rlens[h]++;
		else
		    this.rlens[++h] = 1;
		b = b1;
		bw += b ? 1 : -1;
	    }
	    thisbad += this._badruns(h);
	}

	// black/white imbalance
	if (bw < 0)
	    bw = -bw;

	var big = bw;
	var count = 0;
	big += big << 2;
	big <<= 1;
	while (big > this.width * this.width)
	    big -= this.width * this.width, count++;
	thisbad += count * CONSTANTS["badcoeff"][3];

	// Y runs
	for (x = 0; x < this.width; x++) {
	    this.rlens[0] = 0;
	    for (h = b = y = 0; y < this.width; y++) {
		if ((b1 = this.qrframe[x + this.width * y]) == b)
		    this.rlens[h]++;
		else
		    this.rlens[++h] = 1;
		b = b1;
	    }
	    thisbad += this._badruns(h);
	}
	return thisbad;
    }


    _genframe (instring) {
	var version = 0;
	var x, y, k, t, v, i, j, m;
	var neccblk1, neccblk2, datablkw, eccblkwid; // Control values from
	// table.


	// find the smallest version that fits the string
	t = instring.length;
	do {
	    version++;
	    k = (this.ecclevel - 1) * 4 + (version - 1) * 16;

	    neccblk1 = CONSTANTS["eccblocks"][k++];
	    neccblk2 = CONSTANTS["eccblocks"][k++];
	    datablkw = CONSTANTS["eccblocks"][k++];
	    eccblkwid = CONSTANTS["eccblocks"][k];
	    k = datablkw * (neccblk1 + neccblk2) + neccblk2 - 3 + (version <= 9);
	    if (t <= k)
		break;
	} while (version < 40);

	// FIXME - insure that it fits insted of being truncated
	this.width = 17 + 4 * version;

	// allocate, clear and setup data structures
	v = datablkw + (datablkw + eccblkwid) * (neccblk1 + neccblk2) + neccblk2;
	for( t = 0; t < v; t++ )
	    this.eccbuf[t] = 0;
	this.strinbuf = instring.slice(0);

	for( t = 0; t < this.width * this.width; t++ )
	    this.qrframe[t] = 0;

	for( t = 0 ; t < (this.width * (this.width + 1) + 1) / 2; t++)
	    this.framask[t] = 0;

	// insert finders - black to frame, white to mask
	for (t = 0; t < 3; t++) {
	    k = 0;
	    y = 0;
	    if (t == 1)
		k = (this.width - 7);
	    if (t == 2)
		y = (this.width - 7);
	    this.qrframe[(y + 3) + this.width * (k + 3)] = 1;
	    for (x = 0; x < 6; x++) {
		this.qrframe[(y + x) + this.width * k] = 1;
		this.qrframe[y + this.width * (k + x + 1)] = 1;
		this.qrframe[(y + 6) + this.width * (k + x)] = 1;
		this.qrframe[(y + x + 1) + this.width * (k + 6)] = 1;
	    }
	    for (x = 1; x < 5; x++) {
		this._setmask(y + x, k + 1);
		this._setmask(y + 1, k + x + 1);
		this._setmask(y + 5, k + x);
		this._setmask(y + x + 1, k + 5);
	    }
	    for (x = 2; x < 4; x++) {
		this.qrframe[(y + x) + this.width * (k + 2)] = 1;
		this.qrframe[(y + 2) + this.width * (k + x + 1)] = 1;
		this.qrframe[(y + 4) + this.width * (k + x)] = 1;
		this.qrframe[(y + x + 1) + this.width * (k + 4)] = 1;
	    }
	}

	// alignment blocks
	if (version > 1) {
	    t = CONSTANTS["adelta"][version];
	    y = this.width - 7;
	    for (;;) {
		x = this.width - 7;
		while (x > t - 3) {
		    this._putalign(x, y);
		    if (x < t)
			break;
		    x -= t;
		}
		if (y <= t + 9)
		    break;
		y -= t;
		this._putalign(6, y);
		this._putalign(y, 6);
	    }
	}

	// single black
	this.qrframe[8 + this.width * (this.width - 8)] = 1;

	// timing gap - mask only
	for (y = 0; y < 7; y++) {
	    this._setmask(7, y);
	    this._setmask(this.width - 8, y);
	    this._setmask(7, y + this.width - 7);
	}
	for (x = 0; x < 8; x++) {
	    this._setmask(x, 7);
	    this._setmask(x + this.width - 8, 7);
	    this._setmask(x, this.width - 8);
	}

	// reserve mask-format area
	for (x = 0; x < 9; x++)
	    this._setmask(x, 8);
	for (x = 0; x < 8; x++) {
	    this._setmask(x + this.width - 8, 8);
	    this._setmask(8, x);
	}
	for (y = 0; y < 7; y++)
	    this._setmask(8, y + this.width - 7);

	// timing row/col
	for (x = 0; x < this.width - 14; x++)
	    if (x & 1) {
		this._setmask(8 + x, 6);
		this._setmask(6, 8 + x);
	    }
	    else {
		this.qrframe[(8 + x) + this.width * 6] = 1;
		this.qrframe[6 + this.width * (8 + x)] = 1;
	    }

	// version block
	if (version > 6) {
	    t = CONSTANTS["vpat"][version - 7];
	    k = 17;
	    for (x = 0; x < 6; x++)
		for (y = 0; y < 3; y++, k--)
		    if (1 & (k > 11 ? version >> (k - 12) : t >> k)) {
			this.qrframe[(5 - x) + this.width * (2 - y + this.width - 11)] = 1;
			this.qrframe[(2 - y + this.width - 11) + this.width * (5 - x)] = 1;
		    }
		    else {
			this._setmask(5 - x, 2 - y + this.width - 11);
			this._setmask(2 - y + this.width - 11, 5 - x);
		    }
	}

	// sync mask bits - only set above for white spaces, so add in black bits
	for (y = 0; y < this.width; y++)
	    for (x = 0; x <= y; x++)
		if (this.qrframe[x + this.width * y])
		    this._setmask(x, y);

	// convert string to bitstream
	// 8 bit data to QR-coded 8 bit data (numeric or alphanum, or kanji not
	// supported)
	v = this.strinbuf.length;

	// string to array
	for( i = 0 ; i < v; i++ )
	    this.eccbuf[i] = this.strinbuf.charCodeAt(i);
	this.strinbuf = this.eccbuf.slice(0);

	// calculate max string length
	x = datablkw * (neccblk1 + neccblk2) + neccblk2;
	if (v >= x - 2) {
	    v = x - 2;
	    if (version > 9)
		v--;
	}

	// shift and repack to insert length prefix
	i = v;
	if (version > 9) {
	    this.strinbuf[i + 2] = 0;
	    this.strinbuf[i + 3] = 0;
	    while (i--) {
		t = this.strinbuf[i];
		this.strinbuf[i + 3] |= 255 & (t << 4);
		this.strinbuf[i + 2] = t >> 4;
	    }
	    this.strinbuf[2] |= 255 & (v << 4);
	    this.strinbuf[1] = v >> 4;
	    this.strinbuf[0] = 0x40 | (v >> 12);
	}
	else {
	    this.strinbuf[i + 1] = 0;
	    this.strinbuf[i + 2] = 0;
	    while (i--) {
		t = this.strinbuf[i];
		this.strinbuf[i + 2] |= 255 & (t << 4);
		this.strinbuf[i + 1] = t >> 4;
	    }
	    this.strinbuf[1] |= 255 & (v << 4);
	    this.strinbuf[0] = 0x40 | (v >> 4);
	}
	// fill to end with pad pattern
	i = v + 3 - (version < 10);
	while (i < x) {
	    this.strinbuf[i++] = 0xec;
	    // buffer has room if (i == x) break;
	    this.strinbuf[i++] = 0x11;
	}

	// calculate and append ECC

	// calculate generator polynomial
	this.genpoly[0] = 1;
	for (i = 0; i < eccblkwid; i++) {
	    this.genpoly[i + 1] = 1;
	    for (j = i; j > 0; j--)
		this.genpoly[j] = this.genpoly[j]
	    ? this.genpoly[j - 1] ^ CONSTANTS["gexp"][this._modnn(CONSTANTS["glog"][this.genpoly[j]] + i)] : this.genpoly[j - 1];
	    this.genpoly[0] = CONSTANTS["gexp"][this._modnn(CONSTANTS["glog"][this.genpoly[0]] + i)];
	}
	for (i = 0; i <= eccblkwid; i++)
	    this.genpoly[i] = CONSTANTS["glog"][this.genpoly[i]]; // use logs for
	// genpoly[] to
	// save calc
	// step

	// append ecc to data buffer
	k = x;
	y = 0;
	for (i = 0; i < neccblk1; i++) {
	    this._appendrs(y, datablkw, k, eccblkwid);
	    y += datablkw;
	    k += eccblkwid;
	}
	for (i = 0; i < neccblk2; i++) {
	    this._appendrs(y, datablkw + 1, k, eccblkwid);
	    y += datablkw + 1;
	    k += eccblkwid;
	}
	// interleave blocks
	y = 0;
	for (i = 0; i < datablkw; i++) {
	    for (j = 0; j < neccblk1; j++)
		this.eccbuf[y++] = this.strinbuf[i + j * datablkw];
	    for (j = 0; j < neccblk2; j++)
		this.eccbuf[y++] = this.strinbuf[(neccblk1 * datablkw) + i + (j * (datablkw + 1))];
	}
	for (j = 0; j < neccblk2; j++)
	    this.eccbuf[y++] = this.strinbuf[(neccblk1 * datablkw) + i + (j * (datablkw + 1))];
	for (i = 0; i < eccblkwid; i++)
	    for (j = 0; j < neccblk1 + neccblk2; j++)
		this.eccbuf[y++] = this.strinbuf[x + i + j * eccblkwid];
	this.strinbuf = this.eccbuf;

	// pack bits into frame avoiding masked area.
	x = y = this.width - 1;
	k = v = 1;         // up, minus
	/* inteleaved data and ecc codes */
	m = (datablkw + eccblkwid) * (neccblk1 + neccblk2) + neccblk2;
	for (i = 0; i < m; i++) {
	    t = this.strinbuf[i];
	    for (j = 0; j < 8; j++, t <<= 1) {
		if (0x80 & t)
		    this.qrframe[x + this.width * y] = 1;
		do {        // find next fill position
		    if (v)
			x--;
		    else {
			x++;
			if (k) {
			    if (y != 0)
				y--;
			    else {
				x -= 2;
				k = !k;
				if (x == 6) {
				    x--;
				    y = 9;
				}
			    }
			}
			else {
			    if (y != this.width - 1)
				y++;
			    else {
				x -= 2;
				k = !k;
				if (x == 6) {
				    x--;
				    y -= 8;
				}
			    }
			}
		    }
		    v = !v;
		} while (this._ismasked(x, y));
	    }
	}

	// save pre-mask copy of frame
	this.strinbuf = this.qrframe.slice(0);
	t = 0;           // best
	y = 30000;         // demerit
	// for instead of while since in original arduino code
	// if an early mask was "good enough" it wouldn't try for a better one
	// since they get more complex and take longer.
	for (k = 0; k < 8; k++) {
	    this._applymask(k);      // returns black-white imbalance
	    x = this._badcheck();
	    if (x < y) { // current mask better than previous best?
		y = x;
		t = k;
	    }
	    if (t == 7)
		break;       // don't increment i to a void redoing mask
	    this.qrframe = this.strinbuf.slice(0); // reset for next pass
	}
	if (t != k)         // redo best mask - none good enough, last wasn't t
	    this._applymask(t);

	// add in final mask/ecclevel bytes
	y = CONSTANTS["fmtword"][t + ((this.ecclevel - 1) << 3)];
	// low byte
	for (k = 0; k < 8; k++, y >>= 1)
	    if (y & 1) {
		this.qrframe[(this.width - 1 - k) + this.width * 8] = 1;
		if (k < 6)
		    this.qrframe[8 + this.width * k] = 1;
		else
		    this.qrframe[8 + this.width * (k + 1)] = 1;
	    }
	// high byte
	for (k = 0; k < 7; k++, y >>= 1)
	    if (y & 1) {
		this.qrframe[8 + this.width * (this.width - 7 + k)] = 1;
		if (k)
		    this.qrframe[(6 - k) + this.width * 8] = 1;
		else
		    this.qrframe[7 + this.width * 8] = 1;
	    }

	// return image
	return this.qrframe;
    }

    /**
     * Public methods
     */

    encode (instring, ecclevel) {
	var i, j;
	var hash = [];

	if (instring == undefined) throw new Error('no string passed'); 

	this.ecclevel = (ecclevel == undefined) ? 1 : ecclevel;

	if (this.ecclevel < 1 || this.ecclevel > 4) throw new Error('wrong ecclevel'); 

	var frame = this._genframe(instring);

	for (i = 0; i < this.width; i++) {
	    hash.push( frame.slice(i * this.width, this.width + (i * this.width) ) );
	}


	return hash;
    }

}


module.exports = new QrEncoder();