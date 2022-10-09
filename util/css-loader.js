(async () => {
    GM.addStyle(await (await fetch('http://localhost:5000/style.user.css')).text());
})();