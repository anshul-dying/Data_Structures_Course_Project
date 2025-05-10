function AVL(am, w, h) {
	this.init(am, w, h);

}

AVL.prototype = new Algorithm();
AVL.prototype.constructor = AVL;
AVL.superclass = Algorithm.prototype;


// Various constants

// AVL.HIGHLIGHT_LABEL_COLOR = "#FF0000"
// AVL.HIGHLIGHT_LINK_COLOR = "#FF0000"

// AVL.HIGHLIGHT_COLOR = "#007700"
// AVL.HEIGHT_LABEL_COLOR = "#007700"


// AVL.LINK_COLOR = "#007700";
// AVL.HIGHLIGHT_CIRCLE_COLOR = "#007700";
// AVL.FOREGROUND_COLOR = "0x007700";
// AVL.BACKGROUND_COLOR = "#DDFFDD";
// AVL.PRINT_COLOR = AVL.FOREGROUND_COLOR;

// Various constants

AVL.HIGHLIGHT_LABEL_COLOR = "#dc2626"; // Red for highlights
AVL.HIGHLIGHT_LINK_COLOR = "#dc2626";  // Red for highlighted links

AVL.HIGHLIGHT_COLOR = "#2563eb";       // Primary blue
AVL.HEIGHT_LABEL_COLOR = "#1e40af";    // Darker blue for labels

AVL.LINK_COLOR = "#2563eb";            // Primary blue for links
AVL.HIGHLIGHT_CIRCLE_COLOR = "#60a5fa"; // Light blue for highlights
AVL.FOREGROUND_COLOR = "#1e293b";      // Text primary color
AVL.BACKGROUND_COLOR = "#f1f5f9";      // Light background
AVL.PRINT_COLOR = AVL.FOREGROUND_COLOR;

AVL.WIDTH_DELTA = 70;
AVL.HEIGHT_DELTA = 50;
AVL.STARTING_Y = 80;

AVL.FIRST_PRINT_POS_X = 50;
AVL.PRINT_VERTICAL_GAP = 20;
AVL.PRINT_HORIZONTAL_GAP = 50;
AVL.EXPLANITORY_TEXT_X = 10;
AVL.EXPLANITORY_TEXT_Y = 10;



AVL.prototype.init = function (am, w, h) {
	var sc = AVL.superclass;
	var fn = sc.init;
	this.first_print_pos_y = h - 2 * AVL.PRINT_VERTICAL_GAP;
	this.print_max = w - 10;

	fn.call(this, am, w, h);
	this.startingX = w / 2;
	this.addControls();
	this.nextIndex = 1;
	this.commands = [];
	this.cmd("CreateLabel", 0, "", AVL.EXPLANITORY_TEXT_X, AVL.EXPLANITORY_TEXT_Y, 0);
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();

}

AVL.prototype.addControls = function () {
	this.insertField = addControlToAlgorithmBar("Text", "");
	this.insertField.onkeydown = this.returnSubmit(this.insertField, this.insertCallback.bind(this), 4);
	this.insertButton = addControlToAlgorithmBar("Button", "Insert");
	this.insertButton.onclick = this.insertCallback.bind(this);
	this.deleteField = addControlToAlgorithmBar("Text", "");
	this.deleteField.onkeydown = this.returnSubmit(this.deleteField, this.deleteCallback.bind(this), 4);
	this.deleteButton = addControlToAlgorithmBar("Button", "Delete");
	this.deleteButton.onclick = this.deleteCallback.bind(this);
	this.findField = addControlToAlgorithmBar("Text", "");
	this.findField.onkeydown = this.returnSubmit(this.findField, this.findCallback.bind(this), 4);
	this.findButton = addControlToAlgorithmBar("Button", "Find");
	this.findButton.onclick = this.findCallback.bind(this);
	this.printButton = addControlToAlgorithmBar("Button", "Print");
	this.printButton.onclick = this.printCallback.bind(this);
}

AVL.prototype.reset = function () {
	this.nextIndex = 1;
	this.treeRoot = null;
}




AVL.prototype.insertCallback = function (event) {
	var insertedValue = this.insertField.value;
	// Get text value
	insertedValue = this.normalizeNumber(insertedValue, 4);
	if (insertedValue != "") {
		// set text value
		this.insertField.value = "";
		this.implementAction(this.insertElement.bind(this), insertedValue);
	}
}

AVL.prototype.deleteCallback = function (event) {
	var deletedValue = this.deleteField.value;
	if (deletedValue != "") {
		deletedValue = this.normalizeNumber(deletedValue, 4);
		this.deleteField.value = "";
		this.implementAction(this.deleteElement.bind(this), deletedValue);
	}
}


AVL.prototype.findCallback = function (event) {
	var findValue = this.findField.value;
	if (findValue != "") {
		findValue = this.normalizeNumber(findValue, 4);
		this.findField.value = "";
		this.implementAction(this.findElement.bind(this), findValue);
	}
}

AVL.prototype.printCallback = function (event) {
	this.implementAction(this.printTree.bind(this), "");
}

AVL.prototype.sizeChanged = function (newWidth, newHeight) {
	this.startingX = newWidth / 2;
}



AVL.prototype.printTree = function (unused) {
	this.commands = [];

	if (this.treeRoot != null) {
		this.highlightID = this.nextIndex++;
		var firstLabel = this.nextIndex;
		this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, this.treeRoot.x, this.treeRoot.y);
		this.xPosOfNextLabel = AVL.FIRST_PRINT_POS_X;
		this.yPosOfNextLabel = this.first_print_pos_y;
		this.printTreeRec(this.treeRoot);
		this.cmd("Delete", this.highlightID);
		this.cmd("Step");
		for (var i = firstLabel; i < this.nextIndex; i++)
			this.cmd("Delete", i);
		this.nextIndex = this.highlightID;  /// Reuse objects.  Not necessary.
	}
	return this.commands;
}

AVL.prototype.printTreeRec = function (tree) {
	this.cmd("Step");
	if (tree.left != null) {
		this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
		this.printTreeRec(tree.left);
		this.cmd("Move", this.highlightID, tree.x, tree.y);
		this.cmd("Step");
	}
	var nextLabelID = this.nextIndex++;
	this.cmd("CreateLabel", nextLabelID, tree.data, tree.x, tree.y);
	this.cmd("SetForegroundColor", nextLabelID, AVL.PRINT_COLOR);
	this.cmd("Move", nextLabelID, this.xPosOfNextLabel, this.yPosOfNextLabel);
	this.cmd("Step");

	this.xPosOfNextLabel += AVL.PRINT_HORIZONTAL_GAP;
	if (this.xPosOfNextLabel > this.print_max) {
		this.xPosOfNextLabel = AVL.FIRST_PRINT_POS_X;
		this.yPosOfNextLabel += AVL.PRINT_VERTICAL_GAP;

	}
	if (tree.right != null) {
		this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
		this.printTreeRec(tree.right);
		this.cmd("Move", this.highlightID, tree.x, tree.y);
		this.cmd("Step");
	}
	return;
}


AVL.prototype.findElement = function (findValue) {
	this.commands = [];

	this.highlightID = this.nextIndex++;

	this.doFind(this.treeRoot, findValue);


	return this.commands;
}


AVL.prototype.doFind = function (tree, value) {
	this.cmd("SetText", 0, "Searchiing for " + value);
	if (tree != null) {
		this.cmd("SetHighlight", tree.graphicID, 1);
		if (tree.data == value) {
			this.cmd("SetText", 0, "Searching for " + value + " : " + value + " = " + value + " (Element found!)");
			this.cmd("Step");
			this.cmd("SetText", 0, "Found:" + value);
			this.cmd("SetHighlight", tree.graphicID, 0);
		}
		else {
			if (tree.data > value) {
				this.cmd("SetText", 0, "Searching for " + value + " : " + value + " < " + tree.data + " (look to left subtree)");
				this.cmd("Step");
				this.cmd("SetHighlight", tree.graphicID, 0);
				if (tree.left != null) {
					this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
					this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
					this.cmd("Step");
					this.cmd("Delete", this.highlightID);
				}
				this.doFind(tree.left, value);
			}
			else {
				this.cmd("SetText", 0, " Searching for " + value + " : " + value + " > " + tree.data + " (look to right subtree)");
				this.cmd("Step");
				this.cmd("SetHighlight", tree.graphicID, 0);
				if (tree.right != null) {
					this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
					this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
					this.cmd("Step");
					this.cmd("Delete", this.highlightID);
				}
				this.doFind(tree.right, value);
			}

		}

	}
	else {
		this.cmd("SetText", 0, " Searching for " + value + " : " + "< Empty Tree > (Element not found)");
		this.cmd("Step");
		this.cmd("SetText", 0, " Searching for " + value + " : " + " (Element not found)");
	}
}

AVL.prototype.insertElement = function (insertedValue) {
	this.commands = [];
	this.cmd("SetText", 0, " Inserting " + insertedValue);

	if (this.treeRoot == null) {
		var treeNodeID = this.nextIndex++;
		var labelID = this.nextIndex++;
		this.cmd("CreateCircle", treeNodeID, insertedValue, this.startingX, AVL.STARTING_Y);
		this.cmd("SetForegroundColor", treeNodeID, AVL.FOREGROUND_COLOR);
		this.cmd("SetBackgroundColor", treeNodeID, AVL.BACKGROUND_COLOR);
		this.cmd("CreateLabel", labelID, 1, this.startingX - 20, AVL.STARTING_Y - 20);
		this.cmd("SetForegroundColor", labelID, AVL.HEIGHT_LABEL_COLOR);
		this.cmd("Step");
		this.treeRoot = new AVLNode(insertedValue, treeNodeID, labelID, this.startingX, AVL.STARTING_Y);
		this.treeRoot.height = 1;
	}
	else {
		treeNodeID = this.nextIndex++;
		labelID = this.nextIndex++;
		this.highlightID = this.nextIndex++;

		this.cmd("CreateCircle", treeNodeID, insertedValue, 30, AVL.STARTING_Y);

		this.cmd("SetForegroundColor", treeNodeID, AVL.FOREGROUND_COLOR);
		this.cmd("SetBackgroundColor", treeNodeID, AVL.BACKGROUND_COLOR);
		this.cmd("CreateLabel", labelID, "", 100 - 20, 100 - 20);
		this.cmd("SetForegroundColor", labelID, AVL.HEIGHT_LABEL_COLOR);
		this.cmd("Step");
		var insertElem = new AVLNode(insertedValue, treeNodeID, labelID, 100, 100)

		this.cmd("SetHighlight", insertElem.graphicID, 1);
		insertElem.height = 1;
		this.insert(insertElem, this.treeRoot);
		//				this.resizeTree();				
	}
	this.cmd("SetText", 0, " ");
	return this.commands;
}


AVL.prototype.singleRotateRight = function (tree) {
	var B = tree;
	var A = tree.left;
	var t2 = A.right;

	this.cmd("SetText", 0, "Single Rotate Right (LL Rotation)");
	this.cmd("SetEdgeHighlight", B.graphicID, A.graphicID, 1);
	this.cmd("Step");

	if (t2 != null) {
		this.cmd("Disconnect", A.graphicID, t2.graphicID);
		this.cmd("Connect", B.graphicID, t2.graphicID, AVL.LINK_COLOR);
		t2.parent = B;
	}
	this.cmd("Disconnect", B.graphicID, A.graphicID);
	this.cmd("Connect", A.graphicID, B.graphicID, AVL.LINK_COLOR);
	
	if (B.parent != null) {
		this.cmd("Disconnect", B.parent.graphicID, B.graphicID);
		this.cmd("Connect", B.parent.graphicID, A.graphicID, AVL.LINK_COLOR);
		if (B.isLeftChild()) {
			B.parent.left = A;
		} else {
			B.parent.right = A;
		}
	} else {
		this.treeRoot = A;
	}
	
	A.parent = B.parent;
	B.parent = A;
	A.right = B;
	B.left = t2;

	this.resetHeight(B);
	this.resetHeight(A);
	this.resizeTree();
}



AVL.prototype.singleRotateLeft = function (tree) {
	var A = tree;
	var B = tree.right;
	var t2 = B.left;

	this.cmd("SetText", 0, "Single Rotate Left (RR Rotation)");
	this.cmd("SetEdgeHighlight", A.graphicID, B.graphicID, 1);
	this.cmd("Step");

	if (t2 != null) {
		this.cmd("Disconnect", B.graphicID, t2.graphicID);
		this.cmd("Connect", A.graphicID, t2.graphicID, AVL.LINK_COLOR);
		t2.parent = A;
	}
	this.cmd("Disconnect", A.graphicID, B.graphicID);
	this.cmd("Connect", B.graphicID, A.graphicID, AVL.LINK_COLOR);
	
	if (A.parent != null) {
		this.cmd("Disconnect", A.parent.graphicID, A.graphicID);
		this.cmd("Connect", A.parent.graphicID, B.graphicID, AVL.LINK_COLOR);
		if (A.isLeftChild()) {
			A.parent.left = B;
		} else {
			A.parent.right = B;
		}
	} else {
		this.treeRoot = B;
	}
	
	B.parent = A.parent;
	A.parent = B;
	B.left = A;
	A.right = t2;

	this.resizeTree();
}




AVL.prototype.getHeight = function (tree) {
	if (tree == null) {
		return 0;
	}
	return tree.height;
}

AVL.prototype.resetHeight = function (tree) {
	if (tree != null) {
		var newHeight = Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1;
		if (tree.height != newHeight) {
			tree.height = Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1
			this.cmd("SetText", tree.heightLabelID, newHeight);
			//			this.cmd("SetText",tree.heightLabelID, newHeight);
		}
	}
}

AVL.prototype.doubleRotateRight = function (tree) {
	this.cmd("SetText", 0, "Double Rotate Right");
	var A = tree.left;
	var B = tree.left.right;
	var C = tree;
	var t1 = A.left;
	var t2 = B.left;
	var t3 = B.right;
	var t4 = C.right;

	this.cmd("Disconnect", C.graphicID, A.graphicID);
	this.cmd("Disconnect", A.graphicID, B.graphicID);
	this.cmd("Connect", C.graphicID, A.graphicID, AVL.HIGHLIGHT_LINK_COLOR);
	this.cmd("Connect", A.graphicID, B.graphicID, AVL.HIGHLIGHT_LINK_COLOR);
	this.cmd("Step");

	if (t2 != null) {
		this.cmd("Disconnect", B.graphicID, t2.graphicID);
		t2.parent = A;
		A.right = t2;
		this.cmd("Connect", A.graphicID, t2.graphicID, AVL.LINK_COLOR);
	}
	if (t3 != null) {
		this.cmd("Disconnect", B.graphicID, t3.graphicID);
		t3.parent = C;
		C.left = t2;
		this.cmd("Connect", C.graphicID, t3.graphicID, AVL.LINK_COLOR);
	}
	if (C.parent == null) {
		B.parent = null;
		this.treeRoot = B;
	}
	else {
		this.cmd("Disconnect", C.parent.graphicID, C.graphicID);
		this.cmd("Connect", C.parent.graphicID, B.graphicID, AVL.LINK_COLOR);
		if (C.isLeftChild()) {
			C.parent.left = B
		}
		else {
			C.parent.right = B;
		}
		B.parent = C.parent;
		C.parent = B;
	}
	this.cmd("Disconnect", C.graphicID, A.graphicID);
	this.cmd("Disconnect", A.graphicID, B.graphicID);
	this.cmd("Connect", B.graphicID, A.graphicID, AVL.LINK_COLOR);
	this.cmd("Connect", B.graphicID, C.graphicID, AVL.LINK_COLOR);
	B.left = A;
	A.parent = B;
	B.right = C;
	C.parent = B;
	A.right = t2;
	C.left = t3;
	this.resetHeight(A);
	this.resetHeight(C);
	this.resetHeight(B);

	this.resizeTree();


}

AVL.prototype.doubleRotateLeft = function (tree) {
	this.cmd("SetText", 0, "Double Rotate Left");
	var A = tree;
	var B = tree.right.left;
	var C = tree.right;
	var t1 = A.left;
	var t2 = B.left;
	var t3 = B.right;
	var t4 = C.right;

	this.cmd("Disconnect", A.graphicID, C.graphicID);
	this.cmd("Disconnect", C.graphicID, B.graphicID);
	this.cmd("Connect", A.graphicID, C.graphicID, AVL.HIGHLIGHT_LINK_COLOR);
	this.cmd("Connect", C.graphicID, B.graphicID, AVL.HIGHLIGHT_LINK_COLOR);
	this.cmd("Step");

	if (t2 != null) {
		this.cmd("Disconnect", B.graphicID, t2.graphicID);
		t2.parent = A;
		A.right = t2;
		this.cmd("Connect", A.graphicID, t2.graphicID, AVL.LINK_COLOR);
	}
	if (t3 != null) {
		this.cmd("Disconnect", B.graphicID, t3.graphicID);
		t3.parent = C;
		C.left = t2;
		this.cmd("Connect", C.graphicID, t3.graphicID, AVL.LINK_COLOR);
	}


	if (A.parent == null) {
		B.parent = null;
		this.treeRoot = B;
	}
	else {
		this.cmd("Disconnect", A.parent.graphicID, A.graphicID);
		this.cmd("Connect", A.parent.graphicID, B.graphicID, AVL.LINK_COLOR);
		if (A.isLeftChild()) {
			A.parent.left = B
		}
		else {
			A.parent.right = B;
		}
		B.parent = A.parent;
		A.parent = B;
	}
	this.cmd("Disconnect", A.graphicID, C.graphicID);
	this.cmd("Disconnect", C.graphicID, B.graphicID);
	this.cmd("Connect", B.graphicID, A.graphicID, AVL.LINK_COLOR);
	this.cmd("Connect", B.graphicID, C.graphicID, AVL.LINK_COLOR);
	B.left = A;
	A.parent = B;
	B.right = C;
	C.parent = B;
	A.right = t2;
	C.left = t3;
	this.resetHeight(A);
	this.resetHeight(C);
	this.resetHeight(B);

	this.resizeTree();


}

AVL.prototype.insert = function (elem, tree) {
	// Step 1: Compare with root
	this.cmd("SetText", 0, `1) Comparing ${elem.data} with the root node i.e. ${tree.data}`);
	this.cmd("SetHighlight", tree.graphicID, 1);
	this.cmd("SetHighlight", elem.graphicID, 1);
	this.cmd("Step");

	if (elem.data < tree.data) {
		// Step 2: Show direction
		this.cmd("SetText", 0, `2) ${elem.data} is less than the root node i.e. ${tree.data} going towards left`);
		this.cmd("Step");
		
		// Step 3: Check for child
		this.cmd("SetText", 0, `3) Checking whether there is a child node to the left of ${tree.data}`);
		this.cmd("Step");
		
		if (tree.left == null) {
			// Step 7: Insert node if no child exists
			this.cmd("SetText", 0, `7) No child node exists, inserting ${elem.data}`);
			this.cmd("SetText", elem.heightLabelID, 1);
			tree.left = elem;
			elem.parent = tree;
			
			elem.x = tree.x - AVL.WIDTH_DELTA;
			elem.y = tree.y + AVL.HEIGHT_DELTA;
			this.cmd("Move", elem.graphicID, elem.x, elem.y);
			this.cmd("Move", elem.heightLabelID, elem.x, elem.y - 20);
			this.cmd("Step");
			this.cmd("Connect", tree.graphicID, elem.graphicID, AVL.LINK_COLOR);
			this.cmd("Step");
		} else {
			this.cmd("SetText", 0, `4) Child node exists i.e. ${tree.left.data} exists, comparing ${elem.data} with child node`);
			this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
			this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			this.insert(elem, tree.left);
		}
	} else {
		// Similar steps for right side
		this.cmd("SetText", 0, `2) ${elem.data} is greater than or equal to the root node i.e. ${tree.data} going towards right`);
		this.cmd("Step");
		
		this.cmd("SetText", 0, `3) Checking whether there is a child node to the right of ${tree.data}`);
		this.cmd("Step");
		
		if (tree.right == null) {
			this.cmd("SetText", 0, `7) No child node exists, inserting ${elem.data}`);
			this.cmd("SetText", elem.heightLabelID, 1);
			tree.right = elem;
			elem.parent = tree;
			
			elem.x = tree.x + AVL.WIDTH_DELTA;
			elem.y = tree.y + AVL.HEIGHT_DELTA;
			this.cmd("Move", elem.graphicID, elem.x, elem.y);
			this.cmd("Move", elem.heightLabelID, elem.x, elem.y - 20);
			this.cmd("Step");
			this.cmd("Connect", tree.graphicID, elem.graphicID, AVL.LINK_COLOR);
			this.cmd("Step");
		} else {
			this.cmd("SetText", 0, `4) Child node exists i.e. ${tree.right.data} exists, comparing ${elem.data} with child node`);
			this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
			this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			this.insert(elem, tree.right);
		}
	}
	
	// Update height
	tree.height = Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1;
	this.cmd("SetText", tree.heightLabelID, tree.height);
	
	// Calculate balance factor
	var balanceFactor = this.getHeight(tree.left) - this.getHeight(tree.right);
	this.cmd("SetText", 0, `8) Balance factor at node ${tree.data} is ${balanceFactor}`);
	this.cmd("Step");
	
	// Check if rotation is needed
	if (balanceFactor > 1) {
		// Left subtree is higher
		if (elem.data < tree.left.data) {
			// LL case
			this.cmd("SetText", 0, "9) Left-Left case detected, performing right rotation");
			this.cmd("Step");
			this.singleRotateRight(tree);
		} else {
			// LR case
			this.cmd("SetText", 0, "9) Left-Right case detected, performing double rotation");
			this.cmd("Step");
			this.doubleRotateRight(tree);
		}
	} else if (balanceFactor < -1) {
		// Right subtree is higher
		if (elem.data >= tree.right.data) {
			// RR case
			this.cmd("SetText", 0, "9) Right-Right case detected, performing left rotation");
			this.cmd("Step");
			this.singleRotateLeft(tree);
		} else {
			// RL case
			this.cmd("SetText", 0, "9) Right-Left case detected, performing double rotation");
			this.cmd("Step");
			this.doubleRotateLeft(tree);
		}
	}
	
	this.cmd("SetHighlight", tree.graphicID, 0);
	this.cmd("SetHighlight", elem.graphicID, 0);
	this.resizeTree();
}

AVL.prototype.deleteElement = function (deletedValue) {
	this.commands = [];
	this.cmd("SetText", 0, "Deleting " + deletedValue);
	this.cmd("Step");
	this.cmd("SetText", 0, " ");
	this.highlightID = this.nextIndex++;
	this.treeDelete(this.treeRoot, deletedValue);
	this.cmd("SetText", 0, " ");
	return this.commands;
}

AVL.prototype.treeDelete = function (tree, valueToDelete) {
	var leftchild = false;
	if (tree != null) {
		if (tree.parent != null) {
			leftchild = tree.parent.left == tree;
		}
		
		// Step 1: Compare with current node
		this.cmd("SetText", 0, `1) Comparing ${valueToDelete} with current node ${tree.data}`);
		this.cmd("SetHighlight", tree.graphicID, 1);
		this.cmd("Step");
		
		if (valueToDelete < tree.data) {
			// Step 2: Show direction
			this.cmd("SetText", 0, `2) ${valueToDelete} is less than ${tree.data}, going towards left subtree`);
			this.cmd("Step");
			this.cmd("SetHighlight", tree.graphicID, 0);
			
			if (tree.left != null) {
				this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
				this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
				this.cmd("Step");
				this.cmd("Delete", this.highlightID);
			}
			this.treeDelete(tree.left, valueToDelete);
		}
		else if (valueToDelete > tree.data) {
			// Step 2: Show direction
			this.cmd("SetText", 0, `2) ${valueToDelete} is greater than ${tree.data}, going towards right subtree`);
			this.cmd("Step");
			this.cmd("SetHighlight", tree.graphicID, 0);
			
			if (tree.right != null) {
				this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
				this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
				this.cmd("Step");
				this.cmd("Delete", this.highlightID);
			}
			this.treeDelete(tree.right, valueToDelete);
		}
		else {
			// Step 3: Found node to delete
			this.cmd("SetText", 0, `3) Found node to delete: ${tree.data}`);
			this.cmd("Step");
			
			if (tree.left == null && tree.right == null) {
				// Step 4: Leaf node case
				this.cmd("SetText", 0, "4) Node is a leaf node, simply removing it");
				this.cmd("Step");
				
				this.cmd("Delete", tree.graphicID);
				this.cmd("Delete", tree.heightLabelID);
				if (leftchild && tree.parent != null) {
					tree.parent.left = null;
				}
				else if (tree.parent != null) {
					tree.parent.right = null;
				}
				else {
					this.treeRoot = null;
				}
			}
			else if (tree.left == null) {
				// Step 4: One child case (right)
				this.cmd("SetText", 0, "4) Node has only right child, replacing with right child");
				this.cmd("Step");
				
				if (tree.parent != null) {
					this.cmd("Disconnect", tree.parent.graphicID, tree.graphicID);
					this.cmd("Connect", tree.parent.graphicID, tree.right.graphicID, AVL.LINK_COLOR);
					this.cmd("Step");
					this.cmd("Delete", tree.graphicID);
					this.cmd("Delete", tree.heightLabelID);
					if (leftchild) {
						tree.parent.left = tree.right;
					}
					else {
						tree.parent.right = tree.right;
					}
					tree.right.parent = tree.parent;
				}
				else {
					this.cmd("Delete", tree.graphicID);
					this.cmd("Delete", tree.heightLabelID);
					this.treeRoot = tree.right;
					this.treeRoot.parent = null;
				}
			}
			else if (tree.right == null) {
				// Step 4: One child case (left)
				this.cmd("SetText", 0, "4) Node has only left child, replacing with left child");
				this.cmd("Step");
				
				if (tree.parent != null) {
					this.cmd("Disconnect", tree.parent.graphicID, tree.graphicID);
					this.cmd("Connect", tree.parent.graphicID, tree.left.graphicID, AVL.LINK_COLOR);
					this.cmd("Step");
					this.cmd("Delete", tree.graphicID);
					this.cmd("Delete", tree.heightLabelID);
					if (leftchild) {
						tree.parent.left = tree.left;
					}
					else {
						tree.parent.right = tree.left;
					}
					tree.left.parent = tree.parent;
				}
				else {
					this.cmd("Delete", tree.graphicID);
					this.cmd("Delete", tree.heightLabelID);
					this.treeRoot = tree.left;
					this.treeRoot.parent = null;
				}
			}
			else {
				// Step 4: Two children case
				this.cmd("SetText", 0, "4) Node has two children, finding inorder successor");
				this.cmd("Step");
				
				// Find inorder successor
				this.highlightID = this.nextIndex++;
				this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
				var tmp = tree.left;
				this.cmd("Move", this.highlightID, tmp.x, tmp.y);
				this.cmd("Step");
				
				while (tmp.right != null) {
					tmp = tmp.right;
					this.cmd("Move", this.highlightID, tmp.x, tmp.y);
					this.cmd("Step");
				}
				
				this.cmd("SetText", 0, `5) Found inorder successor: ${tmp.data}`);
				this.cmd("Step");
				
				var labelID = this.nextIndex++;
				this.cmd("CreateLabel", labelID, tmp.data, tmp.x, tmp.y);
				tree.data = tmp.data;
				this.cmd("Move", labelID, tree.x, tree.y);
				this.cmd("SetText", 0, "6) Copying successor's value to current node");
				this.cmd("Step");
				
				this.cmd("Delete", labelID);
				this.cmd("SetText", tree.graphicID, tree.data);
				this.cmd("Delete", this.highlightID);
				
				this.cmd("SetText", 0, "7) Deleting the successor node");
				this.cmd("Step");
				
				if (tmp.left == null) {
					if (tmp.parent != tree) {
						tmp.parent.right = null;
					}
					else {
						tree.left = null;
					}
					this.cmd("Delete", tmp.graphicID);
					this.cmd("Delete", tmp.heightLabelID);
				}
				else {
					if (tmp.parent != tree) {
						this.cmd("Disconnect", tmp.parent.graphicID, tmp.graphicID);
						this.cmd("Connect", tmp.parent.graphicID, tmp.left.graphicID, AVL.LINK_COLOR);
						this.cmd("Step");
						this.cmd("Delete", tmp.graphicID);
						this.cmd("Delete", tmp.heightLabelID);
						tmp.parent.right = tmp.left;
						tmp.left.parent = tmp.parent;
					}
					else {
						this.cmd("Disconnect", tree.graphicID, tmp.graphicID);
						this.cmd("Connect", tree.graphicID, tmp.left.graphicID, AVL.LINK_COLOR);
						this.cmd("Step");
						this.cmd("Delete", tmp.graphicID);
						this.cmd("Delete", tmp.heightLabelID);
						tree.left = tmp.left;
						tmp.left.parent = tree;
					}
				}
			}
			
			// Step 8: Check balance
			this.cmd("SetText", 0, "8) Checking balance factors after deletion");
			this.cmd("Step");
			
			// Update heights and check balance
			var current = tree;
			while (current != null) {
				if (this.getHeight(current) != Math.max(this.getHeight(current.left), this.getHeight(current.right)) + 1) {
					current.height = Math.max(this.getHeight(current.left), this.getHeight(current.right)) + 1;
					this.cmd("SetText", current.heightLabelID, current.height);
				}
				
				var balance = this.getHeight(current.left) - this.getHeight(current.right);
				if (Math.abs(balance) > 1) {
					this.cmd("SetText", 0, `9) Balance factor at node ${current.data} is ${balance}, performing rotation`);
					this.cmd("Step");
					
					if (balance > 1) {
						if (this.getHeight(current.left.left) >= this.getHeight(current.left.right)) {
							this.cmd("SetText", 0, "10) Performing LL rotation");
							this.cmd("Step");
							this.singleRotateRight(current);
						}
						else {
							this.cmd("SetText", 0, "10) Performing LR rotation");
							this.cmd("Step");
							this.doubleRotateRight(current);
						}
					}
					else {
						if (this.getHeight(current.right.right) >= this.getHeight(current.right.left)) {
							this.cmd("SetText", 0, "10) Performing RR rotation");
							this.cmd("Step");
							this.singleRotateLeft(current);
						}
						else {
							this.cmd("SetText", 0, "10) Performing RL rotation");
							this.cmd("Step");
							this.doubleRotateLeft(current);
						}
					}
				}
				current = current.parent;
			}
			
			this.cmd("SetText", 0, "11) Done");
			this.resizeTree();
		}
	}
	else {
		this.cmd("SetText", 0, `Element ${valueToDelete} not found in the tree`);
	}
}

AVL.prototype.resizeTree = function () {
	var startingPoint = this.startingX;
	this.resizeWidths(this.treeRoot);
	if (this.treeRoot != null) {
		if (this.treeRoot.leftWidth > startingPoint) {
			startingPoint = this.treeRoot.leftWidth;
		}
		else if (this.treeRoot.rightWidth > startingPoint) {
			startingPoint = Math.max(this.treeRoot.leftWidth, 2 * startingPoint - this.treeRoot.rightWidth);
		}
		this.setNewPositions(this.treeRoot, startingPoint, AVL.STARTING_Y, 0);
		this.animateNewPositions(this.treeRoot);
		this.cmd("Step");
	}

}

AVL.prototype.setNewPositions = function (tree, xPosition, yPosition, side) {
	if (tree != null) {
		tree.y = yPosition;
		if (side == -1) {
			xPosition = xPosition - tree.rightWidth;
		} else if (side == 1) {
			xPosition = xPosition + tree.leftWidth;
		}
		tree.x = xPosition;
		tree.heightLabelX = xPosition;
		tree.heightLabelY = yPosition - 20;
		
		// Recursively set positions for children with proper spacing
		this.setNewPositions(tree.left, xPosition, yPosition + AVL.HEIGHT_DELTA, -1);
		this.setNewPositions(tree.right, xPosition, yPosition + AVL.HEIGHT_DELTA, 1);
	}
}
AVL.prototype.animateNewPositions = function (tree) {
	if (tree != null) {
		this.cmd("Move", tree.graphicID, tree.x, tree.y);
		this.cmd("Move", tree.heightLabelID, tree.heightLabelX, tree.heightLabelY);
		this.animateNewPositions(tree.left);
		this.animateNewPositions(tree.right);
	}
}

AVL.prototype.resizeWidths = function (tree) {
	if (tree == null) {
		return 0;
	}
	tree.leftWidth = Math.max(this.resizeWidths(tree.left), AVL.WIDTH_DELTA);
	tree.rightWidth = Math.max(this.resizeWidths(tree.right), AVL.WIDTH_DELTA);
	return Math.max(tree.leftWidth + tree.rightWidth, 2 * AVL.WIDTH_DELTA);
}


AVL.prototype.disableUI = function (event) {
	this.insertField.disabled = true;
	this.insertButton.disabled = true;
	this.deleteField.disabled = true;
	this.deleteButton.disabled = true;
	this.findField.disabled = true;
	this.findButton.disabled = true;
	this.printButton.disabled = true;
}

AVL.prototype.enableUI = function (event) {
	this.insertField.disabled = false;
	this.insertButton.disabled = false;
	this.deleteField.disabled = false;
	this.deleteButton.disabled = false;
	this.findField.disabled = false;
	this.findButton.disabled = false;
	this.printButton.disabled = false;
}


function AVLNode(val, id, hid, initialX, initialY) {
	this.data = val;
	this.x = initialX;
	this.y = initialY;
	this.heightLabelID = hid;
	this.height = 1;

	this.graphicID = id;
	this.left = null;
	this.right = null;
	this.parent = null;
}

AVLNode.prototype.isLeftChild = function () {
	if (this.parent == null) {
		return true;
	}
	return this.parent.left == this;
}




var currentAlg;

function init() {
	var animManag = initCanvas();
	currentAlg = new AVL(animManag, canvas.width, canvas.height);
}

