document.addEventListener('DOMContentLoaded', function () {
  let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];

  // Function to update wishlist count
  function updateWishlistCount() {
    const wishlistCount = document.querySelector('.wishlist-count');
    if (wishlistCount) {
      wishlistCount.textContent = wishlistItems.length >= 1 ? wishlistItems.length : ''; // Show count if >= 1, else clear it
    }
  }

  // Function to render wishlist
  function renderWishlist() {
    const wishlistList = document.querySelector('.wishlist-list');
    const emptyMessage = document.querySelector('.wishlist-empty-message');

    // Ensure the elements exist before modifying them
    if (!wishlistList || !emptyMessage) {
      return;
    }

    wishlistList.innerHTML = '';

    if (wishlistItems.length === 0) {
      emptyMessage.style.display = 'block';
    } else {
      emptyMessage.style.display = 'none';
      wishlistItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <a href="${item.url}" class="wishlist-image-title">
            <img src="${item.image}" alt="${item.title}" width="" height=""/>
            <p>${item.title}</p>
          </a>
          <div class="wishlist-price">
            <span>${item.price}</span>
            ${item.comparePrice ? `<span class="compare-price"><s>${item.comparePrice}</s></span>` : ''}
          </div>
          <button class="remove-from-wishlist" data-product-id="${item.id}">Remove</button>
        `;
        wishlistList.appendChild(listItem);
      });
    }

    // Update the wishlist count
    updateWishlistCount();
  }

  renderWishlist();

  // Handle Add/Remove to Wishlist
  document.querySelectorAll('.add-to-wishlist').forEach(button => {
    const productId = button.dataset.productId;
    const existingItem = wishlistItems.find(item => item.id === productId);

    // Check if product is already in wishlist and set the active class
    if (existingItem) {
      button.classList.add('active');
    }

    button.addEventListener('click', function () {
      const productId = this.dataset.productId; // 'this' refers to the button
      const existingItem = wishlistItems.find(item => item.id === productId);

      if (existingItem) {
        // If the product is already in the wishlist, remove it
        wishlistItems = wishlistItems.filter(item => item.id !== productId);
        this.classList.remove('active'); // Remove the active class from the button
      } else {
        // If the product is not in the wishlist, add it
        const product = {
          id: productId,
          url: this.dataset.productUrl,
          image: this.dataset.productImage,
          title: this.dataset.productTitle,
          price: this.dataset.productPrice,
          comparePrice: this.dataset.productComparePrice || null // Handle compare price
        };

        wishlistItems.push(product);
        this.classList.add('active'); // Add the active class to the button
      }

      // Update localStorage
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));

      // Directly update the count without waiting for a render
      updateWishlistCount();
    });
  });

  // Handle Remove from Wishlist inside the wishlist display
  const wishlistList = document.querySelector('.wishlist-list');
  if (wishlistList) {
    wishlistList.addEventListener('click', function (e) {
      if (e.target.classList.contains('remove-from-wishlist')) {
        const productId = e.target.dataset.productId;
        wishlistItems = wishlistItems.filter(item => item.id !== productId);
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
        renderWishlist();

        // Remove active class from the respective "Add to Wishlist" button
        const wishlistButton = document.querySelector(`.add-to-wishlist[data-product-id="${productId}"]`);
        if (wishlistButton) {
          wishlistButton.classList.remove('active');
        }

        // Directly update the count without waiting for a render
        updateWishlistCount();
      }
    });
  }

  // Initial update of the wishlist count on page load
  updateWishlistCount();
});
