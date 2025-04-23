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

AVL.WIDTH_DELTA = 50;
AVL.HEIGHT_DELTA = 50;
AVL.STARTING_Y = 50;

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
	var t3 = B.right;
	var A = tree.left;
	var t1 = A.left;
	var t2 = A.right;

	this.cmd("SetText", 0, "Single Rotate Right");
	this.cmd("SetEdgeHighlight", B.graphicID, A.graphicID, 1);
	this.cmd("Step");


	if (t2 != null) {
		this.cmd("Disconnect", A.graphicID, t2.graphicID);
		this.cmd("Connect", B.graphicID, t2.graphicID, AVL.LINK_COLOR);
		t2.parent = B;
	}
	this.cmd("Disconnect", B.graphicID, A.graphicID);
	this.cmd("Connect", A.graphicID, B.graphicID, AVL.LINK_COLOR);
	A.parent = B.parent;
	if (this.treeRoot == B) {
		this.treeRoot = A;
	}
	else {
		this.cmd("Disconnect", B.parent.graphicID, B.graphicID, AVL.LINK_COLOR);
		this.cmd("Connect", B.parent.graphicID, A.graphicID, AVL.LINK_COLOR)
		if (B.isLeftChild()) {
			B.parent.left = A;
		}
		else {
			B.parent.right = A;
		}
	}
	A.right = B;
	B.parent = A;
	B.left = t2;
	this.resetHeight(B);
	this.resetHeight(A);
	this.resizeTree();
}



AVL.prototype.singleRotateLeft = function (tree) {
	var A = tree;
	var B = tree.right;
	var t1 = A.left;
	var t2 = B.left;
	var t3 = B.right;

	this.cmd("SetText", 0, "Single Rotate Left");
	this.cmd("SetEdgeHighlight", A.graphicID, B.graphicID, 1);
	this.cmd("Step");

	if (t2 != null) {
		this.cmd("Disconnect", B.graphicID, t2.graphicID);
		this.cmd("Connect", A.graphicID, t2.graphicID, AVL.LINK_COLOR);
		t2.parent = A;
	}
	this.cmd("Disconnect", A.graphicID, B.graphicID);
	this.cmd("Connect", B.graphicID, A.graphicID, AVL.LINK_COLOR);
	B.parent = A.parent;
	if (this.treeRoot == A) {
		this.treeRoot = B;
	}
	else {
		this.cmd("Disconnect", A.parent.graphicID, A.graphicID, AVL.LINK_COLOR);
		this.cmd("Connect", A.parent.graphicID, B.graphicID, AVL.LINK_COLOR)

		if (A.isLeftChild()) {
			A.parent.left = B;
		}
		else {
			A.parent.right = B;
		}
	}
	B.left = A;
	A.parent = B;
	A.right = t2;
	this.resetHeight(A);
	this.resetHeight(B);

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
	this.cmd("SetText", 0, `Step 1: Comparing ${elem.data} with the root node ${tree.data}`);
	this.cmd("SetHighlight", tree.graphicID, 1);
	this.cmd("SetHighlight", elem.graphicID, 1);
	this.cmd("Step");

	if (elem.data < tree.data) {
		this.cmd("SetText", 0, `Step 2: ${elem.data} is less than the root node ${tree.data}, going towards left`);
	} else {
		this.cmd("SetText", 0, `Step 2: ${elem.data} is greater than or equal to the root node ${tree.data}, going towards right`);
	}
	this.cmd("Step");
	this.cmd("SetHighlight", tree.graphicID, 0);
	this.cmd("SetHighlight", elem.graphicID, 0);

	if (elem.data < tree.data) {
		this.cmd("SetText", 0, `Step 3: Checking whether there is a child node to the left of ${tree.data}`);
		this.cmd("Step");
		
		if (tree.left == null) {
			this.cmd("SetText", 0, `Step 4: No left child exists, inserting ${elem.data} as left child of ${tree.data}`);
			this.cmd("SetText", elem.heightLabelID, 1);
			this.cmd("SetHighlight", elem.graphicID, 0);
			tree.left = elem;
			elem.parent = tree;
			this.cmd("Connect", tree.graphicID, elem.graphicID, AVL.LINK_COLOR);
			this.resizeTree();
			
			this.cmd("SetText", 0, `Step 5: Checking balance factor for ${tree.data}`);
			this.cmd("Step");
			
			if (tree.height < tree.left.height + 1) {
				tree.height = tree.left.height + 1;
				this.cmd("SetText", tree.heightLabelID, tree.height);
				this.cmd("SetText", 0, `Step 6: Adjusting height of ${tree.data} to ${tree.height}`);
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HIGHLIGHT_LABEL_COLOR);
				this.cmd("Step");
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HEIGHT_LABEL_COLOR);
			}
		} else {
			this.cmd("SetText", 0, `Step 4: Left child ${tree.left.data} exists, comparing ${elem.data} with it`);
			this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
			this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			this.insert(elem, tree.left);
			
			this.cmd("SetText", 0, `Step 5: Checking balance factor for ${tree.data}`);
			this.cmd("Step");
			
			if (tree.height < tree.left.height + 1) {
				tree.height = tree.left.height + 1;
				this.cmd("SetText", tree.heightLabelID, tree.height);
				this.cmd("SetText", 0, `Step 6: Adjusting height of ${tree.data} to ${tree.height}`);
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HIGHLIGHT_LABEL_COLOR);
				this.cmd("Step");
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HEIGHT_LABEL_COLOR);
			}
			
			this.cmd("SetText", 0, `Step 7: Checking if rotation is needed for ${tree.data}`);
			this.cmd("Step");
			
			if ((tree.right != null && tree.left.height > tree.right.height + 1) ||
				(tree.right == null && tree.left.height > 1)) {
				this.cmd("SetText", 0, `Step 8: Balance factor is ${tree.left.height - (tree.right ? tree.right.height : 0)}, performing rotation`);
				this.cmd("Step");
				
				if (elem.data < tree.left.data) {
					this.cmd("SetText", 0, "Step 9: Performing LL rotation");
					this.singleRotateRight(tree);
				} else {
					this.cmd("SetText", 0, "Step 9: Performing LR rotation");
					this.doubleRotateRight(tree);
				}
			}
		}
	} else {
		// Similar steps for right subtree
		this.cmd("SetText", 0, `Step 3: Checking whether there is a child node to the right of ${tree.data}`);
		this.cmd("Step");
		
		if (tree.right == null) {
			this.cmd("SetText", 0, `Step 4: No right child exists, inserting ${elem.data} as right child of ${tree.data}`);
			this.cmd("SetText", elem.heightLabelID, 1);
			this.cmd("SetHighlight", elem.graphicID, 0);
			tree.right = elem;
			elem.parent = tree;
			this.cmd("Connect", tree.graphicID, elem.graphicID, AVL.LINK_COLOR);
			this.resizeTree();
			
			this.cmd("SetText", 0, `Step 5: Checking balance factor for ${tree.data}`);
			this.cmd("Step");
			
			if (tree.height < tree.right.height + 1) {
				tree.height = tree.right.height + 1;
				this.cmd("SetText", tree.heightLabelID, tree.height);
				this.cmd("SetText", 0, `Step 6: Adjusting height of ${tree.data} to ${tree.height}`);
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HIGHLIGHT_LABEL_COLOR);
				this.cmd("Step");
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HEIGHT_LABEL_COLOR);
			}
		} else {
			this.cmd("SetText", 0, `Step 4: Right child ${tree.right.data} exists, comparing ${elem.data} with it`);
			this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
			this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			this.insert(elem, tree.right);
			
			this.cmd("SetText", 0, `Step 5: Checking balance factor for ${tree.data}`);
			this.cmd("Step");
			
			if (tree.height < tree.right.height + 1) {
				tree.height = tree.right.height + 1;
				this.cmd("SetText", tree.heightLabelID, tree.height);
				this.cmd("SetText", 0, `Step 6: Adjusting height of ${tree.data} to ${tree.height}`);
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HIGHLIGHT_LABEL_COLOR);
				this.cmd("Step");
				this.cmd("SetForegroundColor", tree.heightLabelID, AVL.HEIGHT_LABEL_COLOR);
			}
			
			this.cmd("SetText", 0, `Step 7: Checking if rotation is needed for ${tree.data}`);
			this.cmd("Step");
			
			if ((tree.left != null && tree.right.height > tree.left.height + 1) ||
				(tree.left == null && tree.right.height > 1)) {
				this.cmd("SetText", 0, `Step 8: Balance factor is ${(tree.left ? tree.left.height : 0) - tree.right.height}, performing rotation`);
				this.cmd("Step");
				
				if (elem.data >= tree.right.data) {
					this.cmd("SetText", 0, "Step 9: Performing RR rotation");
					this.singleRotateLeft(tree);
				} else {
					this.cmd("SetText", 0, "Step 9: Performing RL rotation");
					this.doubleRotateLeft(tree);
				}
			}
		}
	}
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
		this.cmd("SetText", 0, `Step 1: Comparing ${valueToDelete} with the current node ${tree.data}`);
		this.cmd("SetHighlight", tree.graphicID, 1);
		this.cmd("Step");

		if (valueToDelete < tree.data) {
			this.cmd("SetText", 0, `Step 2: ${valueToDelete} is less than ${tree.data}, going towards left`);
		} else if (valueToDelete > tree.data) {
			this.cmd("SetText", 0, `Step 2: ${valueToDelete} is greater than ${tree.data}, going towards right`);
		} else {
			this.cmd("SetText", 0, `Step 2: ${valueToDelete} equals ${tree.data}, found node to delete`);
		}
		this.cmd("Step");
		this.cmd("SetHighlight", tree.graphicID, 0);

		if (valueToDelete == tree.data) {
			if (tree.left == null && tree.right == null) {
				this.cmd("SetText", 0, `Step 3: Node ${tree.data} is a leaf node, deleting it`);
				this.cmd("Delete", tree.graphicID);
				this.cmd("Delete", tree.heightLabelID);
				if (leftchild && tree.parent != null) {
					tree.parent.left = null;
				} else if (tree.parent != null) {
					tree.parent.right = null;
				} else {
					this.treeRoot = null;
				}
				this.resizeTree();
				this.cmd("Step");
			} else if (tree.left == null) {
				this.cmd("SetText", 0, `Step 3: Node ${tree.data} has no left child, replacing with right child`);
				if (tree.parent != null) {
					this.cmd("Disconnect", tree.parent.graphicID, tree.graphicID);
					this.cmd("Connect", tree.parent.graphicID, tree.right.graphicID, AVL.LINK_COLOR);
					this.cmd("Step");
					this.cmd("Delete", tree.graphicID);
					this.cmd("Delete", tree.heightLabelID);
					if (leftchild) {
						tree.parent.left = tree.right;
					} else {
						tree.parent.right = tree.right;
					}
					tree.right.parent = tree.parent;
				} else {
					this.cmd("Delete", tree.graphicID);
					this.cmd("Delete", tree.heightLabelID);
					this.treeRoot = tree.right;
					this.treeRoot.parent = null;
				}
				this.resizeTree();
			} else if (tree.right == null) {
				this.cmd("SetText", 0, `Step 3: Node ${tree.data} has no right child, replacing with left child`);
				if (tree.parent != null) {
					this.cmd("Disconnect", tree.parent.graphicID, tree.graphicID);
					this.cmd("Connect", tree.parent.graphicID, tree.left.graphicID, AVL.LINK_COLOR);
					this.cmd("Step");
					this.cmd("Delete", tree.graphicID);
					this.cmd("Delete", tree.heightLabelID);
					if (leftchild) {
						tree.parent.left = tree.left;
					} else {
						tree.parent.right = tree.left;
					}
					tree.left.parent = tree.parent;
				} else {
					this.cmd("Delete", tree.graphicID);
					this.cmd("Delete", tree.heightLabelID);
					this.treeRoot = tree.left;
					this.treeRoot.parent = null;
				}
				this.resizeTree();
			} else {
				this.cmd("SetText", 0, `Step 3: Node ${tree.data} has both children, finding inorder successor`);
				this.highlightID = this.nextIndex;
				this.nextIndex += 1;
				this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
				var tmp = tree;
				tmp = tree.left;
				this.cmd("Move", this.highlightID, tmp.x, tmp.y);
				this.cmd("Step");
				while (tmp.right != null) {
					tmp = tmp.right;
					this.cmd("Move", this.highlightID, tmp.x, tmp.y);
					this.cmd("Step");
				}
				this.cmd("SetText", tree.graphicID, " ");
				var labelID = this.nextIndex;
				this.nextIndex += 1;
				this.cmd("CreateLabel", labelID, tmp.data, tmp.x, tmp.y);
				this.cmd("SetForegroundColor", labelID, AVL.HEIGHT_LABEL_COLOR);
				tree.data = tmp.data;
				this.cmd("Move", labelID, tree.x, tree.y);
				this.cmd("SetText", 0, `Step 4: Replacing ${tree.data} with inorder successor ${tmp.data}`);
				this.cmd("Step");
				this.cmd("SetHighlight", tree.graphicID, 0);
				this.cmd("Delete", labelID);
				this.cmd("SetText", tree.graphicID, tree.data);
				this.cmd("Delete", this.highlightID);
				this.cmd("SetText", 0, `Step 5: Deleting inorder successor ${tmp.data}`);
				this.cmd("Step");

				if (tmp.left == null) {
					if (tmp.parent != tree) {
						tmp.parent.right = null;
					} else {
						tree.left = null;
					}
					this.cmd("Delete", tmp.graphicID);
					this.cmd("Delete", tmp.heightLabelID);
					this.resizeTree();
				} else {
					this.cmd("Disconnect", tmp.parent.graphicID, tmp.graphicID);
					this.cmd("Connect", tmp.parent.graphicID, tmp.left.graphicID, AVL.LINK_COLOR);
					this.cmd("Step");
					this.cmd("Delete", tmp.graphicID);
					this.cmd("Delete", tmp.heightLabelID);
					if (tmp.parent != tree) {
						tmp.parent.right = tmp.left;
						tmp.left.parent = tmp.parent;
					} else {
						tree.left = tmp.left;
						tmp.left.parent = tree;
					}
					this.resizeTree();
				}
				tmp = tmp.parent;

				this.cmd("SetText", 0, `Step 6: Checking balance factor for ${tmp.data}`);
				this.cmd("Step");

				if (this.getHeight(tmp) != Math.max(this.getHeight(tmp.left), this.getHeight(tmp.right)) + 1) {
					tmp.height = Math.max(this.getHeight(tmp.left), this.getHeight(tmp.right)) + 1;
					this.cmd("SetText", tmp.heightLabelID, tmp.height);
					this.cmd("SetText", 0, `Step 7: Adjusting height of ${tmp.data} to ${tmp.height}`);
					this.cmd("SetForegroundColor", tmp.heightLabelID, AVL.HIGHLIGHT_LABEL_COLOR);
					this.cmd("Step");
					this.cmd("SetForegroundColor", tmp.heightLabelID, AVL.HEIGHT_LABEL_COLOR);
				}

				while (tmp != tree) {
					var tmpPar = tmp.parent;
					this.cmd("SetText", 0, `Step 8: Checking if rotation is needed for ${tmp.data}`);
					this.cmd("Step");

					if (this.getHeight(tmp.left) - this.getHeight(tmp.right) > 1) {
						this.cmd("SetText", 0, `Step 9: Balance factor is ${this.getHeight(tmp.left) - this.getHeight(tmp.right)}, performing rotation`);
						this.cmd("Step");
						if (this.getHeight(tmp.left.right) > this.getHeight(tmp.left.left)) {
							this.cmd("SetText", 0, "Step 10: Performing LR rotation");
							this.doubleRotateRight(tmp);
						} else {
							this.cmd("SetText", 0, "Step 10: Performing LL rotation");
							this.singleRotateRight(tmp);
						}
					}
					if (tmpPar.right != null) {
						if (tmpPar == tree) {
							this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tmpPar.left.x, tmpPar.left.y);
						} else {
							this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tmpPar.right.x, tmpPar.right.y);
						}
						this.cmd("Move", this.highlightID, tmpPar.x, tmpPar.y);
						this.cmd("SetText", 0, "Step 11: Moving up the tree");
						this.cmd("Step");
						this.cmd("Delete", this.highlightID);
					}
					tmp = tmpPar;
				}
			}
		} else if (valueToDelete < tree.data) {
			if (tree.left != null) {
				this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
				this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
				this.cmd("Step");
				this.cmd("Delete", this.highlightID);
			}
			this.treeDelete(tree.left, valueToDelete);
		} else {
			if (tree.right != null) {
				this.cmd("CreateHighlightCircle", this.highlightID, AVL.HIGHLIGHT_COLOR, tree.x, tree.y);
				this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
				this.cmd("Step");
				this.cmd("Delete", this.highlightID);
			}
			this.treeDelete(tree.right, valueToDelete);
		}
	} else {
		this.cmd("SetText", 0, `Step 1: Element ${valueToDelete} not found in the tree`);
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
			tree.heightLabelX = xPosition - 20;
		}
		else if (side == 1) {
			xPosition = xPosition + tree.leftWidth;
			tree.heightLabelX = xPosition + 20;
		}
		else {
			tree.heightLabelX = xPosition - 20;
		}
		tree.x = xPosition;
		tree.heightLabelY = tree.y - 20;
		this.setNewPositions(tree.left, xPosition, yPosition + AVL.HEIGHT_DELTA, -1)
		this.setNewPositions(tree.right, xPosition, yPosition + AVL.HEIGHT_DELTA, 1)
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
	tree.leftWidth = Math.max(this.resizeWidths(tree.left), AVL.WIDTH_DELTA / 2);
	tree.rightWidth = Math.max(this.resizeWidths(tree.right), AVL.WIDTH_DELTA / 2);
	return tree.leftWidth + tree.rightWidth;
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
