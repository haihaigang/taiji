(function() {

    startShake()

    function startShake() {
        jdShake.start({
            duration: 500,
            onShaking: function() {
                $('.shake-shake-ani').addClass('shake');
                return false;
            },
            onEnd: function() {
                $('.shake-shake-ani').removeClass('shake');
                jdShake.destroy();
                startShake();
                return false;
            }
        });
    }
})();
