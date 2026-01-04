// index.js
// Implementations for the DOM testing lab.

//create an element with attributes
function createElementWithAttributes(tag, attributes = {}) {
  const element = document.createElement(tag);
  Object.keys(attributes).forEach((attr) => {
    // allow setting dataset and className convenience keys
    if (attr === 'textContent') {
      element.textContent = attributes[attr];
    } else if (attr === 'className') {
      element.className = attributes[attr];
    } else {
      element.setAttribute(attr, attributes[attr]);
    }
  });
  return element;
}

// Display an error message in the DOM
function displayError(message, errorElementId = 'error-message') {
  const errorElement = document.getElementById(errorElementId);
  if (!errorElement) return;
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
}

// Add text to a target container in the DOM
function addElementToDOM(targetId, content) {
  const target = document.getElementById(targetId);
  if (!target) {

    return null;
  }

  // If content is a Node, append it. Otherwise append a text node inside a div.
  if (content instanceof Node) {
    target.appendChild(content);
  } else {
    const wrapper = createElementWithAttributes('div', {});
    wrapper.textContent = String(content);
    target.appendChild(wrapper);
  }
  return target;
}

// Remove an element from the DOM by id
function removeElementFromDOM(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return false;
  if (el.parentNode) {
    el.parentNode.removeChild(el);
    return true;
  }
  return false;
}

// Simulate a button click that updates a target element's contents
function simulateClick(targetId, message) {
  const target = document.getElementById(targetId);
  if (!target) return null;

  // Create a button with an attached click handler
  const btn = createElementWithAttributes('button', { type: 'button', id: 'simulated-button' });
  btn.textContent = 'Simulated Button';

  // Click handler appends the message to the target
  const handler = () => {
    addElementToDOM(targetId, message);
  };

  btn.addEventListener('click', handler);

  // The button does not need to be visible in the tests, but append so event context is complete
  document.body.appendChild(btn);

  // Programmatically dispatch a click event to simulate a user click
  btn.click();

  // Cleanup: remove the button and listener to avoid side-effects
  btn.removeEventListener('click', handler);
  if (btn.parentNode) btn.parentNode.removeChild(btn);

  return target;
}

// Handle form submission: attaches an event listener for real use and also
// processes immediately when the function is called (so tests can call it directly)
function handleFormSubmit(formId, targetId) {
  const form = document.getElementById(formId);
  const target = document.getElementById(targetId);

  if (!form) return null;
  if (!target) return null;

  // Real submit handler for runtime usage
  const submitHandler = (event) => {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    const input = form.querySelector('input[type="text"], input, textarea');
    const value = input ? input.value.trim() : '';

    if (!value) {
      displayError('Input cannot be empty');
      return false;
    }

    addElementToDOM(targetId, value);
    return true;
  };

  // Avoid attaching multiple duplicate listeners: remove previous one if present
  // We'll use a weak convention: store a symbol on the form to indicate we've attached a listener
  if (!form.__submitListenerAttached) {
    form.addEventListener('submit', submitHandler);
    form.__submitListenerAttached = true;
  }

  // For test convenience: process immediately (simulate a synchronous submit)
  const input = form.querySelector('input[type="text"], input, textarea');
  const value = input ? input.value.trim() : '';
  if (!value) {
    displayError('Input cannot be empty');
    return null;
  }

  addElementToDOM(targetId, value);
  return target;
}

// Export functions for tests
module.exports = {
  createElementWithAttributes,
  displayError,
  addElementToDOM,
  removeElementFromDOM,
  simulateClick,
  handleFormSubmit,
};
