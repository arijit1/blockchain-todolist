App = {
    load: async () => {
        console.log("app loading");
    }
}

$(()=>{
    $(window).load(()=>{
        App.load()
    })
})