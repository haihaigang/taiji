/**
 * 功能：操作某目录下的文件，实现批量删除、改名等操作
 * 命令：node xx.js 
 * 参数：-p xx 目录，要操作文件的目录
 *      -d *.png 删除符合条件的文件
 *      -r *a.png *a1.png 更改文件名，符合条件的文件改成该规则的文件
 *      -lc *.* 小写文件名
 *      -uc *.* 大写文件名
 * 
 */
const fs = require('fs');
const folderSep = '/';

try {
    var curpwd = process.env.PWD; //当前执行命令所在的目录
    var args = process.argv.splice(2);
    var opts = processParams(args);

    const subFiles = fs.readdirSync(curpwd);
    subFiles.map(function(sfile, i) {
        const subStat = fs.statSync(sfile);
        if (subStat.isFile()) {
            opts.map(function(op) {
                switch (op.opt) {
                    case '-d':
                        {
                            deleteFile(op.params, sfile);
                            break;
                        }
                    case '-lc':
                        {
                            lowerCaseFile(op.params, sfile);
                            break;
                        }
                    case '-uc':
                        {
                            upperCaseFile(op.params, sfile);
                            break;
                        }
                }
            });
        }
    })
} catch (ex) {
    console.log(ex);
}

function processParams(args) {
    var params_len = {
        '-p': 1,
        '-d': 1,
        '-r': 2,
        '-lc': 1,
        '-uc': 1
    };
    var group = [];
    for (var i in args) {
        if (args[i].substr(0, 1) == '-') {
            var d = {};
            var n = params_len[args[i]];

            d.opt = args[i];
            d.params = [];
            for (var j = 1; j <= n; j++) {
                d.params.push(args[(parseInt(i) + j)]);
            }

            group.push(d);
        }
    }

    return group;
}

function deleteFile(params, fileName) {
    if (new RegExp(params[0]).test(fileName)) {
        fs.unlinkSync(fileName)
    }
}

function lowerCaseFile(params, fileName) {
    if (new RegExp(params[0]).test(fileName)) {
        var newFileName = fileName.toLowerCase();
        fs.renameSync(fileName, newFileName);
    }
}

function upperCaseFile(params, fileName) {
    if (new RegExp(params[0]).test(fileName)) {
        var newFileName = fileName.toUpperCase();
        fs.renameSync(fileName, newFileName);
    }
}
