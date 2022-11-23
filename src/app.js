App = {
    contracts : {},
    load: async () => {
        console.log("app loading");
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.render();

    },
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(window.ethereum)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */ })
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */ })
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },
    loadAccount: async () => {
        if (typeof window.ethereum !== 'undefined') {
            const res = await window.ethereum.request({ method: "eth_requestAccounts" });
            App.account = res[0];
            console.log(App.account);
        } else {
            window.alert("Please connect to Metamask.")
        }
    },
    loadContract: async () => {
        const todolist = await $.getJSON('Todolist.json');
        App.contracts.Todolist = TruffleContract(todolist);
        App.contracts.Todolist.setProvider(App.web3Provider);
        App.todolist = await App.contracts.Todolist.deployed();
        console.log(todolist);
    },
    setLoading: (value) => {
        App.loading = value;
        const loader = $("#loader");
        const content = $("#content");
        if (value) {
            loader.show();
            content.hide();
        } else {
            loader.hide();
            content.show();
        }
    },
    render: async () => {
        if (App.loading) {
            return;
        }

        App.setLoading(true);
        $("#account").html(App.account);
        await App.renderTasks();
        App.setLoading(false);
    },
    renderTasks: async () => {
        const taskCount = await App.todolist.taskCount();
        const $taskTemplate = $(".taskTemplate");
        for (var i = 1; i <= taskCount; i++) {
            const task = await App.todolist.tasks(i);
            const taskId = task[0].toNumber();
            const taskContent = task[1];
            const taskCompleted = task[2];

            const $newTaskTemplate = $taskTemplate.clone();
            $newTaskTemplate.find(".content").html(taskContent);
            $newTaskTemplate.find("input")
                .prop("name", taskId)
                .prop("checked", taskCompleted)
                .on("click", App.toggleCompleted);

            if (taskCompleted) {
                $("#completedTaskList").append($newTaskTemplate);
            } else {
                $("#taskList").append($newTaskTemplate);
            }

            $newTaskTemplate.show();
        }
    },
    createTask: async () => {
        App.setLoading(true);
        const content = document.getElementById("newTask").value;
        console.log(content)
        await App.todolist.createTask(content , { "from" : App.account });
        window.location.reload();
    },
    toggleCompleted: async (e) => {
        App.setLoading(true);
        const taskId = e.target.name;
        await App.todolist.toggleCompleted(taskId , {"from": App.account})
        window.location.reload();
    }
}

$(() => {
    $(window).load(() => {
        App.load()
    })
})