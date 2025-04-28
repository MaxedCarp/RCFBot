const fs = require('node:fs');
class fs2 {
    static writeFile(path, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, data, (err) => {
                if (err) return reject(err);
                resolve(true);
            });
        })
    }
    static readFile(path, encoding = null) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, encoding, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data);
            });
        });
    }
    static async exists(path) {
        return !!(await fs2.stat(path));
    }
    static stat(path) {
        return new Promise((resolve) => {
            fs.stat(path, (err, stat) => {
                if (err || !stat) return resolve(null);
                resolve(stat);
            });
        });
    }
	static unlink(path) {
		return new Promise((resolve) => {
            fs.unlink(path, (err, stat) => {
                if (err || !stat) return resolve(null);
                resolve(unlink);
            });
        });
	}
	static readdir(path) {
		return new Promise((resolve) => {
            fs.readdir(path, (err, files) => {
                if (err || !files) return resolve(null);
                resolve(files);
            });
        });
	}
}
module.exports = fs2;