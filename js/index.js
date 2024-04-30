
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
document.getElementById('menu').addEventListener('click', function() {
    var submenu = document.getElementById('submenu');
    if (submenu.style.display === "block") {
      submenu.style.display = "none";
    } else {
      submenu.style.display = "block";
    }
  });

  document.getElementById('menu_two').addEventListener('click', function() {
    var submenu = document.getElementById('submenu_two');
    if (submenu.style.display === "block") {
      submenu.style.display = "none";
    } else {
      submenu.style.display = "block";
    }
  });