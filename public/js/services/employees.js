define([
    'jQuery',
    'Underscore',
], function ($, _) {
    function retriveUserName(str) {
        var symbolPos;

        str = str || '';
        symbolPos = str.indexOf('@');

        if (symbolPos === -1) {
            symbolPos = str.length;
        }

        return str.substring(0, symbolPos);
    }

    function onEmailEdit(e) {
        var $targetEl = $(e.target);
        var enteredEmail = $targetEl.val();
        var $thisEl = this.$el;
        var $userName = $thisEl.find('#userName');
        var userName;

        userName = retriveUserName(enteredEmail);

        if ($userName.length) {
            $userName.text(userName);
        }

        return userName;
    }

    return {
        onEmailEdit    : onEmailEdit,
        retriveUserName: retriveUserName
    };
});
