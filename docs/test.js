function Purchases() {
  "use strict";
  var BASE_ID = 0;

  //used to hold items in the purchases list. Needs renamed to something more appropriate.
  var cart = {
    items: [],
    totalPrice: 0
  };

  //Formats the total price value to two decimal places
  function formatTotalPriceString() {
    return `Total: $${cart.totalPrice.toFixed(2)}`;
  }

  //generates and ID for the paragraph element containing the purchse entry
  function generateId() {
    BASE_ID += 1;
    return BASE_ID;
  }


  //generates an Item object with a name, a price, and an associated id
  function makeItem(name, price) {
    return {
      name: name,
      price: price,
      id: generateId()
    };
  }

  //removes an item from the cart given the Item id
  function removeItem(id) {
    // purposfully allowing coercion here
    cart.items = cart.items.filter(i => i.id != id);
  }


  //adds an item to the cart
  function addItem(item) {
    cart.items.push(item);
  }

  //updates the total price of the items list (cart)
  function priceCheck() {
    cart.totalPrice = cart.items.reduce((i, itm) => {
      i += Number(itm.price);
      return i;
    }, 0);
  }

  //gets the current total of item prices
  function getCurrentTotal() {
    return cart.totalPrice;
  }

  //validator used to check that input price values are numbers
  function validateNumber(n) {
    return !isNaN(n);
  }

//adds an item object to the item list (cart)
  function addToCart(item) {
    addItem(item);
    priceCheck();
    updateTotalPrice();
  }

  //calls remove item to remove an item object from the cart by id. 
  //recalculates the total price using priceCheck()
  //updates the total price in the DOM using updateTotalPrice()
  function removeFromCart(id) {
    removeItem(id);
    priceCheck();
    updateTotalPrice();
  }

  //calls removeItem over all items in the cart
  //recalculates the total price (it will be 0.00)
  //updates the totalPrice in the DOM
  function deleteAllItems() {
    cart.items.forEach(({ id }) => removeItem(id));
    priceCheck();
    updateTotalPrice();
  }

  //checks if a given element is visbile or not
  function checkVisible(element) {
      if (element.is(":hidden")) {
        return true;
      } else {
        return false;
      }
    }

  //check if a given elements exists
  function checkExist(element) {
    if (element.length) {
        return true;
      } else {
        return false;
      }
   }

  // used to create the 'delete' and 'add' buttons for the page
  function createButton(buttonClass, buttonText) {
      //build button
      var $button = $('<button class="'+buttonClass+'">'+buttonText+'</button>');
      //return built button
      return $button;
  }

  //creates a new <p></p> element that contains information about the item object created using the inputs from the page.
  function createEntry() {
      //object for wrapper html for item
      var $item = $("<p>");
      //create delete button
      var $delete_button = createButton("item-delete", "delete");
      //define input field
      var $item_name = $("#item-name");
      var $item_value = $("#item-value");
      var name = $item_name.val();
      var value = Number($item_value.val()).toFixed(2);
      //conditional check for input field
      if (name !== "" && validateNumber(value)) {
        //set content for entry
        var item = makeItem(name, value);
        addToCart(item);
        $item.html(`${item.name}, ${'$'+item.price}`);
        $item.attr('itemID', item.id);
        //append delete button to each entry
        $item.prepend($delete_button);
        //hide new entry to setup fadeIn...
        $item.hide();
        //hide delete button until user selects entry
        $delete_button.hide();
        //append item text to item-output
        $(".item-output").append($item);
        //fadeIn hidden new entry
        $item.fadeIn("slow");
        //clear entry value
        $item_name.val("");
        $item_value.val("");
        //check visibility of item controls
        if (checkVisible($(".item-controls")) === true) {
          $(".item-controls").fadeIn();
        }
      } else {
        $item_name.text("Hiya!");
      }
  }

  //updates the total price in the DOM
  function updateTotalPrice() {
    var $elem = $('#totalPrice');
    $elem.html(formatTotalPriceString());
  }

  //handle user event for `add` button click
  $(".entry button").on("click", function(e) {
      //call note builder function
      createEntry();
  });

    //handle user event for keyboard press -- currently doesnt work
  $(".item-name input").on("keypress", function(e) {
      //check code for keyboard press
      if (e.keyCode === 13) {
        createEntry();
      }
  });

    //handle deletion of single entry - bind to existing element...
  $(".item-output").on("click", "button.item-delete" , function() {
      //delete parent entry and remove the parent from the cart using its item id
      var $parent = $(this).parent();
      var itemID = $parent.attr('itemID');
      $parent.remove();
      removeFromCart(itemID);
      //set item selector
      var $item = $(".item-output p");
      //check for empty entries, and then remove item-controls
        if (checkExist($item) === false) {
          //hide item-controls
          $(".item-controls").hide();
        }
  });

    //handle deletion of all entries
  $("#items-delete").on("click", function(e) {
      //set entry selector
      var $item = $(".item-output p");
      //check $item exists
      if (checkExist($item) === true) {
        //hide item-controls
        $(this).parent().hide();
        //remove all entries
        deleteAllItems();
        $item.remove();
      }
  });

    //handle click event per entry
  $(".item-output").on("click", "p", function() {
      //check if other delete buttons visible
      if (checkVisible($("button.item-delete")) === true) {
        //set all siblings to active=false to ensure checks are correct
        $(this).siblings().attr("active", "false");
        $("button.item-delete").hide();
      }
      //then handle click event for current entry
      if (!$(this).attr("active") || $(this).attr("active") === "false") {
        $(this).attr("active", "true");
        $(this).children("button.item-delete").show();
      } else if ($(this).attr("active") === "true") {
        $(this).attr("active", "false");
        $(this).children("button.item-delete").hide();
      }
  });
  // initial calc of total price
  updateTotalPrice();
};

$(document).ready(Purchases);











