const CREATE_MODAL = document.getElementById('createModal');
const UPDATE_MODAL = document.getElementById('updateModal');
const DELETE_MODAL = document.getElementById('deleteModal');

const CREATE_FORM = document.getElementById('createForm');
const UPDATE_FORM = document.getElementById('updateForm');

const CREATE_FORM_LABEL_INPUT = document.getElementById('createFormLabelInput');
const CREATE_FORM_URL_INPUT = document.getElementById('createFormUrlInput');

const UPDATE_FORM_LABEL_INPUT = document.getElementById('updateFormLabelInput');
const UPDATE_FORM_URL_INPUT = document.getElementById('updateFormUrlInput');
const UPDATE_FORM_IS_ACTIVE_INPUT = document.getElementById(
  'updateFormIsActiveInput',
);

let observerToEdit = null;
let observerUuidToDelete = null;

function openCreateModal() {
  CREATE_MODAL.classList.remove('hidden');
}

function closeCreateModal() {
  CREATE_MODAL.classList.add('hidden');
}

function openUpdateModal(uuid) {
  fetch(`/observers/${uuid}`).then((response) => {
    response.json().then((observer) => {
      observerToEdit = observer;

      UPDATE_FORM_LABEL_INPUT.value = observer.label;
      UPDATE_FORM_URL_INPUT.value = observer.url;
      UPDATE_FORM_IS_ACTIVE_INPUT.checked = observer.isActive;
    });
  });

  UPDATE_MODAL.classList.remove('hidden');
}

function closeUpdateModal() {
  observerToEdit = null;
  UPDATE_MODAL.classList.add('hidden');
}

function openDeleteModal(uuid) {
  observerUuidToDelete = uuid;
  DELETE_MODAL.classList.remove('hidden');
}

function closeDeleteModal() {
  observerUuidToDelete = null;
  DELETE_MODAL.classList.add('hidden');
}

async function confirmDelete() {
  if (!observerUuidToDelete) {
    closeDeleteModal();
    return;
  }

  await fetch(`/observers/${observerUuidToDelete}`, {
    method: 'DELETE',
  });

  closeDeleteModal();

  window.location.reload();
}

CREATE_FORM.addEventListener('submit', async (e) => {
  e.preventDefault();

  const label = CREATE_FORM_LABEL_INPUT.value;
  const url = CREATE_FORM_URL_INPUT.value;

  await fetch('/observers', {
    body: JSON.stringify({
      label,
      url,
    }),

    headers: {
      'Content-Type': 'application/json',
    },

    method: 'POST',
  });

  closeCreateModal();

  window.location.reload();
});

UPDATE_FORM.addEventListener('submit', async (e) => {
  e.preventDefault();

  const label = UPDATE_FORM_LABEL_INPUT.value;
  const url = UPDATE_FORM_URL_INPUT.value;
  const isActive = UPDATE_FORM_IS_ACTIVE_INPUT.checked;

  await fetch(`/observers/${observerToEdit.uuid}`, {
    body: JSON.stringify({
      label,
      url,
      isActive,
    }),

    headers: {
      'Content-Type': 'application/json',
    },

    method: 'PATCH',
  });

  closeUpdateModal();

  window.location.reload();
});
