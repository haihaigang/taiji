(function() {

    jdShake.start({
        duration: 500,
        onShaking: function() {
            // $("#prizepap").hide();
            // that.p.find("[tag=shakeicon]").hide();
            // lottoGame.start(0);
            // wa("jdClick", { ptag: cgiData["UD"].shakelist.length == 0 ? "137626.2.1" : "137626.4.3" });
            return false;
        },
        onEnd: function() {
            alert('摇一摇结束')
            jdShake.destroy();
            return false;
        }
    });
})();
