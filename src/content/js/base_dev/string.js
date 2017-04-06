/**
 * 自定义验证，用于简单的规格验证
 */
(function() {
    String.prototype.isSpaces = function() {
        for (var i = 0; i < this.length; i += 1) {
            var ch = this.charAt(i);
            if (ch != ' ' && ch != "\n" && ch != "\t" && ch != "\r") {
                return false;
            }
        }
        return true;
    };

    String.prototype.isValidMail = function() {
        return (new RegExp(
                /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)
            .test(this));
    };

    String.prototype.isPhone = function() {
        return (new RegExp(/^1\d{10}?$/).test(this));
    };

    String.prototype.isEmpty = function() {
        return (/^\s*$/.test(this));
    };

    String.prototype.isValidPwd = function() {
        return (new RegExp(/^([_]|[a-zA-Z0-9@]){6,16}$/).test(this));
    };

    String.prototype.isPostCode = function() {
        return (new RegExp(/^\d{6}?$/).test(this));
    };
})()
