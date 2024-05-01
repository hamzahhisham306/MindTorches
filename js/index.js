// let language = 'en'; // Default language is English
window.addEventListener('DOMContentLoaded', loadLanguageJSON);
function MultiSelectTag(el, customs = { shadow: false, rounded: true }) {
    var element = null,
        options = null,
        customSelectContainer = null,
        wrapper = null,
        btnContainer = null,
        body = null,
        inputContainer = null,
        inputBody = null,
        input = null,
        button = null,
        drawer = null,
        ul = null;


    var tagColor = customs.tagColor || {};
    tagColor.textColor = "#332D3B";
    tagColor.borderColor = "#F3F2F3";
    tagColor.bgColor = "#F3F2F3";


    var domParser = new DOMParser();

    init();

    function init() {

        element = document.getElementById(el);
        createElements();
        initOptions();
        enableItemSelection();
        setValues(false);


        button.addEventListener('click', () => {
            if (drawer.classList.contains('hidden')) {
                initOptions();
                enableItemSelection();
                drawer.classList.remove('hidden');
                input.focus();
            } else {
                drawer.classList.add('hidden');
            }
        });

        input.addEventListener('keyup', (e) => {
            initOptions(e.target.value);
            enableItemSelection();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && inputContainer.childElementCount > 1) {
                const child = body.children[inputContainer.childElementCount - 2].firstChild;
                const option = options.find((op) => op.value == child.dataset.value);
                option.selected = false;
                removeTag(child.dataset.value);
                setValues();
            }
        });

        window.addEventListener('click', (e) => {
            if (!customSelectContainer.contains(e.target)) {
                if ((e.target.nodeName !== "LI") && (e.target.getAttribute("class") !== "input_checkbox")) {
                    drawer.classList.add('hidden');
                } else {

                    enableItemSelection();
                }
            }
        });
    }

    function createElements() {

        options = getOptions();
        element.classList.add('hidden');


        customSelectContainer = document.createElement('div');
        customSelectContainer.classList.add('mult-select-tag');

        wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');

        body = document.createElement('div');
        body.classList.add('body');
        if (customs.shadow) {
            body.classList.add('shadow');
        }
        if (customs.rounded) {
            body.classList.add('rounded');
        }


        inputContainer = document.createElement('div');
        inputContainer.classList.add('input-container');

        input = document.createElement('input');
        input.classList.add('input');
        input.placeholder = `${customs.placeholder || 'Search...'}`;

        inputBody = document.createElement('inputBody');
        inputBody.classList.add('input-body');
        inputBody.append(input);

        body.append(inputContainer);

        btnContainer = document.createElement('div');
        btnContainer.classList.add('btn-container');


        button = document.createElement('button');
        button.type = 'button';
        btnContainer.append(button);

        const icon = domParser.parseFromString(
            `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 21 6 15"></polyline>
            </svg>`, 'image/svg+xml').documentElement;

        button.append(icon);

        body.append(btnContainer);
        wrapper.append(body);

        drawer = document.createElement('div');
        drawer.classList.add(...['drawer', 'hidden']);
        if (customs.shadow) {
            drawer.classList.add('shadow');
        }
        if (customs.rounded) {
            drawer.classList.add('rounded');
        }
        drawer.append(inputBody);
        ul = document.createElement('ul');

        drawer.appendChild(ul);

        customSelectContainer.appendChild(wrapper);
        customSelectContainer.appendChild(drawer);


        if (element.nextSibling) {
            element.parentNode.insertBefore(customSelectContainer, element.nextSibling);
        } else {
            element.parentNode.appendChild(customSelectContainer);
        }
    }

    function createElementInSelectList(option, val, selected = false) {

        const li = document.createElement('li');
        li.innerHTML = "<input type='checkbox' style='margin:0 0.5em 0 0' class='input_checkbox'>"; // add the checkbox at the left of the <li>
        li.innerHTML += option.label;
        li.dataset.value = option.value;
        const checkbox = li.firstChild;
        checkbox.dataset.value = option.value;


        if (val && option.label.toLowerCase().startsWith(val.toLowerCase())) {
            ul.appendChild(li);
        } else if (!val) {
            ul.appendChild(li);
        }


        if (selected) {
            li.style.backgroundColor = tagColor.bgColor;
            checkbox.checked = true;
        }
    }

    function initOptions(val = null) {
        ul.innerHTML = '';
        for (var option of options) {

            if (option.selected) {
                !isTagSelected(option.value) && createTag(option);


                createElementInSelectList(option, val, true);
            } else {
                createElementInSelectList(option, val);
            }
        }
    }

    function createTag(option) {

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item-container');
        itemDiv.style.color = tagColor.textColor || '#2c7a7b';
        itemDiv.style.borderColor = tagColor.borderColor || '#81e6d9';
        itemDiv.style.background = tagColor.bgColor || '#e6fffa';
        const itemLabel = document.createElement('div');
        itemLabel.classList.add('item-label');
        itemLabel.style.color = tagColor.textColor || '#2c7a7b';
        itemLabel.innerHTML = option.label;
        itemLabel.dataset.value = option.value;
        const itemClose = domParser.parseFromString(
            `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="item-close-svg">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>`, 'image/svg+xml').documentElement;

        itemClose.addEventListener('click', (e) => {
            const unselectOption = options.find((op) => op.value == option.value);
            unselectOption.selected = false;
            removeTag(option.value);
            initOptions();
            setValues();
        });

        itemDiv.appendChild(itemLabel);
        itemDiv.appendChild(itemClose);
        inputContainer.append(itemDiv);
    }

    function enableItemSelection() {

        for (var li of ul.children) {
            li.addEventListener('click', (e) => {
                if (options.find((o) => o.value == e.target.dataset.value).selected === false) {
                    options.find((o) => o.value == e.target.dataset.value).selected = true;
                    input.value = null;
                    initOptions();
                    setValues();

                } else {
                    options.find((o) => o.value == e.target.dataset.value).selected = false;
                    input.value = null;
                    initOptions();
                    setValues();
                    removeTag(e.target.dataset.value);
                }
            });
        }
    }

    function isTagSelected(val) {

        for (var child of inputContainer.children) {
            if (!child.classList.contains('input-body') && child.firstChild.dataset.value == val) {
                return true;
            }
        }
        return false;
    }

    function removeTag(val) {

        for (var child of inputContainer.children) {
            if (!child.classList.contains('input-body') && child.firstChild.dataset.value == val) {
                inputContainer.removeChild(child);
            }
        }
    }

    function setValues(fireEvent = true) {

        selected_values = [];
        for (var i = 0; i < options.length; i++) {
            element.options[i].selected = options[i].selected;
            if (options[i].selected) {
                selected_values.push({ label: options[i].label, value: options[i].value });
            }
        }
        if (fireEvent && customs.hasOwnProperty('onChange')) {
            customs.onChange(selected_values);
        }
    }

    function getOptions() {
        return [...element.options].map((op) => {
            return {
                value: op.value,
                label: op.label,
                selected: op.selected,
            };
        });
    }
}
document.getElementById('menu').addEventListener('click', function () {
    var submenu = document.getElementById('submenu');
    if (submenu.style.display === "block") {
        submenu.style.display = "none";
    } else {
        submenu.style.display = "block";
    }
});

document.getElementById('menu_two').addEventListener('click', function () {
    var submenu = document.getElementById('submenu_two');
    if (submenu.style.display === "block") {
        submenu.style.display = "none";
    } else {
        submenu.style.display = "block";
    }
});


const checkboxes = document.querySelectorAll('.custom-checkbox');
const selectedValuesDiv = document.getElementById('selectedValues');

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            const value = this.value;
            const label = this.nextElementSibling.textContent;
            const item = document.createElement('div');
            item.textContent = label;
            const removeButton = document.createElement('button');
            removeButton.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 1L1 11M11 11L1 0.999998" stroke="#2C2C2C" stroke-width="1.5" stroke-linecap="round"/>
        </svg>` ;
            removeButton.addEventListener('click', function () {
                item.remove();
                checkbox.checked = false;
            });
            item.appendChild(removeButton);
            selectedValuesDiv.appendChild(item);
        } else {
            const label = this.nextElementSibling.textContent;
            const items = selectedValuesDiv.querySelectorAll('div');
            items.forEach(item => {
                if (item.textContent.includes(label)) {
                    item.remove();
                }
            });
        }
    });
});

const closeInList = document.getElementById("closeInList");
const in_list = document.querySelector(".in_list_overlay");
const overlay = document.querySelector(".overlay");
const in_listButton = document.getElementById("in_list_show");
const cancel = document.querySelector(".cancel");
const loader_conatiner = document.querySelector(".loader_conatiner");
const overlay_loading = document.querySelector(".overlay_loading");

closeInList.addEventListener("click", function () {
    in_list.classList.remove("show");
    overlay.classList.remove("show")
    in_list.classList.add("hidden");
    overlay.classList.add("hidden")

});

cancel.addEventListener("click", function () {
    in_list.classList.remove("show");
    overlay.classList.remove("show")
    in_list.classList.add("hidden");
    overlay.classList.add("hidden")
})

in_listButton.addEventListener("click", function () {
    in_list.classList.remove("hidden");
    overlay.classList.remove("hidden")
    in_list.classList.add("show");
    overlay.classList.add("show")

})
function switchLanguage(lang) {
    language = lang;
    if (lang === 'ar') {
        document.documentElement.dir = 'rtl';
        localStorage.setItem("lang", "ar")
        loadLanguageJSON(language);
    } else {
        document.documentElement.dir = 'ltr'
        localStorage.setItem("lang", "en")
        loadLanguageJSON(language);
    }
}

function loadLanguageJSON(language) {
    overlay_loading.classList.add("show");
    loader_conatiner.classList.add("show");

    setTimeout(() => {
        overlay_loading.classList.remove("show");
        loader_conatiner.classList.remove("show");
    }, 3000);

    const lang = localStorage.getItem("lang") || "en";
    localStorage.setItem("lang", lang);

    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    const langFile = lang === "en" ? "en.json" : "ar.json";

    fetch(`../lang/${langFile}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("There is probelm loading file");
            }
            return response.json();
        })
        .then(data => {
            console.log("data>>>>>>>>>", data);
            applyTranslations(data);
        })
        .catch(error => console.error("Error Data>>:", error));
}

function applyTranslations(translations) {
    for (let key in translations) {
        const elements = document.querySelectorAll(`[data-translate="${key}"]`);
        elements.forEach(element => {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                element.value = translations[key];
            } else {
                element.innerHTML = translations[key];
            }
        });
    }
}