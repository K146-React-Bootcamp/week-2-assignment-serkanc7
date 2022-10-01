renderHeader();

const todosUrl = "https://jsonplaceholder.typicode.com/todos";
const tbodyEl = document.querySelector("#tbody");
const editModal = document.querySelector("#editModal");
const pagiItems = document.querySelector('[data-nav=items]');
const nextBtn = document.querySelector('[data-btn=next]');
const prevBtn = document.querySelector('[data-btn=prev]');
let todos = [];
let todo;


let current_page = 1;
let rows = 10;


const renderTodos = (page = 1) => {

	tbodyEl.innerHTML = "";
	
	
	const renderItem = (item) => {
		const tr = document.createElement("tr");
		tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.title}</td>
      <td>${item.userId}</td>
      <td>${item.completed ? "Tamamlandı" : "Yapılacak"}</td>
      <td>
        <button class="btn btn-xs btn-danger remove" data-id=${
					item.id
				}>Sil</button>
        <button class="btn btn-xs btn-warning edit" data-id=${
					item.id
				}>Düzenle</button>
      </td>
    `;
		tbodyEl.appendChild(tr);
	};

	page --;
	let start = rows * page;
	let end = start + rows;
	let paginatedItems = todos.slice(start, end);
	paginatedItems.forEach((item) => {
		renderItem(item);
	});


	const generateNextPrevButtons = () => {
		current_page == 1 ? prevBtn.classList.add('disabled') : prevBtn.classList.remove('disabled');
		current_page == Math.ceil(todos.length / rows) ? nextBtn.classList.add('disabled') : nextBtn.classList.remove('disabled');
	}

	generateNextPrevButtons();

	document.querySelectorAll(".remove").forEach((button) => {
		button.addEventListener("click", (e) => {
			const id = Number(e.currentTarget.getAttribute("data-id"));
			if (confirm("kaydı silmek istediğinize emin misiniz?")) {
				todos = todos.filter((x) => x.id !== id);
				// aynı sayfada kalması için current_page parametresi eklendi.
				renderTodos(current_page);
			}
		});
	});

	document.querySelectorAll(".edit").forEach((button) => {
		button.addEventListener("click", (e) => {
			const id = Number(e.currentTarget.getAttribute("data-id"));
			todo = todos.find((todo) => todo.id == id);
			editModal.querySelector("#title").value = todo.title;
			editModal.querySelector("#completed").checked = todo.completed;
			editModal.style.display = "block";
			editModal.classList.add("show");
		});
	});



};



function SetupPagination () {
	pagiItems.innerHTML = "";
	let page_count = Math.ceil(todos.length / rows);
	for (let i = 1; i < page_count + 1; i++) {
		let btn = PaginationButton(i);
		pagiItems.appendChild(btn);
	}
};

function PaginationButton (page){

	let button = document.createElement('li');
	button.classList.add('page-item');
	button.innerHTML = `<a class="page-link" href="#">${page}</a>`;
	if (current_page == page) button.classList.add('active');

	button.addEventListener('click', () => {
		current_page = page;
		renderTodos(current_page);
		let current_btn = document.querySelector('.page-item.active');
		current_btn.classList.remove('active');
		button.classList.add('active');
		
	});
	return button;

}


nextBtn.addEventListener('click', () => {
	current_page++;
	renderTodos(current_page);
	SetupPagination();
});

prevBtn.addEventListener('click', () => {
	current_page--;
	renderTodos(current_page);
	SetupPagination();
});


document.querySelector('#title-sorting').addEventListener('click',() => {
	// başlığa tıklandığında sıralama yapılacak.
	todos.sort((a, b) => {
		// küçük ve büyük harf farkını engellemek için
		const nameA = a.title.toUpperCase(); // ignore upper and lowercase
		const nameB = b.title.toUpperCase(); // ignore upper and lowercase
		if (nameA < nameB) {
		  return -1;
		}
		if (nameA > nameB) {
		  return 1;
		}
	  
		// names must be equal
		return 0;
	  });
	  // sıralama yapılacak tekrar o sayfada render edilecek.
	  renderTodos(current_page);
});


editModal.querySelector("#save").addEventListener("click", () => {
	todo.title = editModal.querySelector("#title").value;
	todo.completed = editModal.querySelector("#completed").checked;
	const index = todos.findIndex((t) => t.id == todo.id);
	todos[index] = todo;
	renderTodos();
	editModal.style.display = "none";
	editModal.classList.remove("show");
});

editModal.querySelectorAll(".close").forEach((button) => {
	button.addEventListener("click", () => {
		editModal.style.display = "none";
		editModal.classList.remove("show");
	});
});


fetch(todosUrl)
	.then((resp) => resp.json())
	.then((data = []) => {
		todos = data;
		renderTodos();
		SetupPagination();
	})
	.catch((error) => {
		errorLogger(error);
	});



	// sıralama ödevi algoritması
	// table thead kısmındaki sıralama yapılacak kolonlara event listener eklenecek.
	// event listener hangi kolon için tıklanıyorsa
	// sort metodu kullanılarak sıralama yapılacak
	// sıralanmış todos'todus içerisine atılacak
	// renderTodos metodu çalıştırılacak.