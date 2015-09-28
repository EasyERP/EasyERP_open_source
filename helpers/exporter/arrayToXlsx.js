(function () {
    var Workbook, XLSX, buildWorkbook, datenum, findHeaders, fs, getAttrs, isodate, path, sheetFromJson, _;

    fs = require("fs");

    path = require("path");

    _ = require("lodash");

    XLSX = require('xlsx');

    isodate = require("isodate");

    datenum = function (v, date1904) {
        var epoch;
        if (date1904) {
            v += 1462;
        }
        epoch = Date.parse(v);
        return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    };

    findHeaders = function (data, lookInFirst) {
        var final, headers, limit;
        limit = lookInFirst || 30;
        headers = [];
        _.each(data, function (r, i) {
            var p;
            for (p in r) {
                if (!_.contains(headers, p)) {
                    headers.push(p);
                }
            }
            if (i === (limit - 1)) {
                return false;
            }
        });
        final = _.map(headers, function (h) {
            return h.replace(/^([a-z])/, function (r) {
                return r.toUpperCase();
            }).replace(/\w\_\w/g, function (r) {
                return r[0] + " " + r[2].toUpperCase();
            }).replace(/\w([A-Z])/g, function (r) {
                return r[0] + " " + r[1];
            });
        });
        return final;
    };

    getAttrs = function (data, lookInFirst) {
        var attrs, limit;
        limit = lookInFirst || 30;
        attrs = [];
        _.each(data, function (r, i) {
            var p;
            for (p in r) {
                if (!_.contains(attrs, p)) {
                    attrs.push(p);
                }
            }
            if (i === (limit - 1)) {
                return false;
            }
        });
        return attrs;
    };

    sheetFromJson = function (data, opts) {
        var headerObj, headers, range, ws;
        ws = {};
        range = {
            s: {
                c: 10000000,
                r: 10000000
            },
            e: {
                c: 0,
                r: 0
            }
        };
        opts = opts || {};
        if (opts.headers) {
            headers = opts.headers;
        } else {
            headers = findHeaders(data);
        }
        headerObj = {};
        _.each(headers, function (h, idx) {
            var attr;
            attr = opts.attributes[idx];
            if (attr) {
                return headerObj[attr] = h;
            }
        });
        data.unshift(headerObj);
        _.each(data, function (row, R) {
            var C;
            C = 0;

            _.each(opts.attributes, function (prop) {
                var cell, cell_ref, r, val;
                val = row[prop] || "";
                if (range.s.r > R) {
                    range.s.r = R;
                }
                if (range.s.c > C) {
                    range.s.c = C;
                }
                if (range.e.r < R) {
                    range.e.r = R;
                }
                if (range.e.c < C) {
                    range.e.c = C;
                }
                cell = {
                    v: val
                };
                if (cell.v == null) {
                    return true;
                }
                cell_ref = XLSX.utils.encode_cell({
                    c: C,
                    r: R
                });
                if (typeof cell.v === "number" || typeof cell.v === "'number'") {
                    cell.t = "n";
                } else if (typeof cell.v === "boolean") {
                    cell.t = "b";
                } else if (cell.v instanceof Date) {
                    cell.t = "n";
                    cell.z = XLSX.SSF._table[14];
                    cell.v = datenum(cell.v);
                } else {
                    r = /\d{4}\-[01]\d\-[0-3]\dT[0-2]\d\:[0-5]\d\:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/;
                    try {
                        cell.v = cell.v.toString();
                        if (cell.v.match(r)) {
                            cell.t = "n";
                            cell.z = XLSX.SSF._table[14];
                            cell.v = datenum(isodate(cell.v));
                        } else {
                            cell.t = "s";
                        }
                    }

                    catch (ex) {
                        console.log(ex);
                    }

                }
                ws[cell_ref] = cell;
                C++;
            });
        });
        if (range.s.c < 10000000) {
            ws["!ref"] = XLSX.utils.encode_range(range);
        }
        return ws;
    };

    Workbook = function () {
        if (!(this instanceof Workbook)) {
            return new Workbook();
        }
        this.SheetNames = [];
        this.Sheets = {};
    };

    buildWorkbook = function (data, options) {
        var attrs, opts, wb, ws;
        options || (options = {});
        if (!options.headers) {
            options.headers = findHeaders(data);
        }
        if (!options.attributes) {
            attrs = getAttrs(data);

            options.attributes = attrs;
        }
        if (!options.sheetName) {
            options.sheetName = "Sheet 1";
        }
        opts = {
            headers   : options.headers,
            attributes: options.attributes
        };
        wb = new Workbook();
        ws = sheetFromJson(data, opts);
        wb.SheetNames.push(options.sheetName);
        wb.Sheets[options.sheetName] = ws;
        return wb;
    };

    module.exports = {
        writeFile  : function (filename, data, options) {
            var wb;
            if (!filename || !data) {
                throw new Error("filename and data parameters are required.");
            } else {
                wb = buildWorkbook(data, options);
                XLSX.writeFile(wb, filename);
            }
            return filename;
        },
        writeBuffer: function (data, options) {
            var buffer, wb;
            buffer = null;
            if (!data) {
                throw new Error("data parameter is required.");
            } else {
                wb = buildWorkbook(data, options);
                buffer = XLSX.write(wb, {
                    type: "buffer"
                });
            }
            return buffer;
        }
    };

}).call(this);