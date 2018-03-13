
	@import url(css/reset.css);		/* Resets html elements */
	@import url(http://fonts.googleapis.com/css?family=Josefin+Slab); /* Installs a webfont ----->		font-family: 'Josefin Slab', serif; */
body{
	font-family:Georgia, "Times New Roman", Times, serif;
	color:#5d5d5d;
}
header h1,
footer h1{
	font-family: 'Josefin Slab', serif;
	color:#aaaaaa;
	font-size:3em;
}
header,footer{
	background:#5d5d5d;
	padding:40px 30px;
	text-align:center;
	-moz-box-shadow:inset 0 0 20px #000000;
	-webkit-box-shadow:inset 0 0 20px #000000;
	box-shadow:inset 0 0 20px #000000;
}
header{
	border-bottom:1px solid #dddddd;
}
footer{
	border-top:1px solid #dddddd;
}
/* ----- Article styling ----- */
article{
	font-family:Georgia, "Times New Roman", Times, serif;
	font-size:16px;
	padding:30px;
}
article h1,h2,h3,h4{
	font-family: 'Josefin Slab', serif;
	font-weight:normal;
	color:#ff4800;
}
article h1{
	font-size:2.6em;
}
article h2{
	font-size:2em;
}
article h3{
	font-size:1.6em;
}
article h4{
	font-size:1.2em;
}
article figcaption,
article figure,
article dd,
article dt,
article pre,
article p,
article h1,
article h2,
article h3,
article h4{
	padding:10px 0;
}
article p,
article ol,
article ul,
article dd,
article figcaption,
.column{
	line-height:1.8em;
}
article ol,ul{
	margin:0 0 0 30px;
	padding:10px;
}
article ol{
	list-style:decimal;
}
article ul{
	list-style:disc;
}
article pre{
	margin:0 0 0 20px;
}
article code{
	font-family:"Courier New", Courier, monospace;
	font-size:12px;
	line-height:1.6em;
}
article blockquote{
	border-left:5px solid #dddddd;
	margin:10px 0 10px 20px;
	background:#f9f9f9;
	font-style:italic;
	padding:10px;
}
article b,strong{
	padding:5px;
	background:#ffdbcd;
}
article em{
	font-style:italic;
}
article a{
	color:#d86a3f;
	text-decoration:none;
	border-bottom:1px solid;
}
article a:hover{
	color:#5d5d5d;
}
article dl{
	margin:10px 0 10px 20px;
}
article dt{
	font-weight:bold;
}
article figure{
	text-align:center;
}
article figure img{
	max-width:100%;
}
article figcaption{
	color:#8d8d8d;
}

/* seo friendly tables */
.table{
	display:table;	/* Defines a Table */
	font-family:Arial, Helvetica, sans-serif;
	font-size:14px;
	border-bottom:2px solid #dddddd;
	color:#8d8d8d;
	margin:10px 0;
}
.table-head{
	 display: table-header-group; /* Defines a table header group */
}
.table-head .column{ /* Column inside the table-head */
	background:#cccccc;
	color:#7d7d7d;
	border-right:1px solid #5d5d5d;
	border-bottom:none;
}
.table-head .column:hover{ /* Column hover inside the table-head */
	background:#222222;
}
.row{
	display:table-row; /* Defines a table row */
}
.row .column:nth-child(1){ /* First column in a row */
	border-left:1px solid #eeeeee;
}
.row:last-child .column{  /* column in a last row */
	border-bottom:none;
}
.column{
	display:table-cell; /* Defines a table cell */
	padding:10px 20px;
	border-bottom:1px solid #eeeeee;
	border-right:1px solid #eeeeee;
}
.column:hover{
	background:#f9f9f9;
}
/* Responsive table */
@media all and (max-width: 640px){
	.table,
	.row,
	.column,
	.column:before{
		display:block;	/* Converts a table, table row, table column and table column:before into a block element */
	}
	.table,
	.row .column:last-child{
		border-bottom:none;
	}
	.table-head{
		position:absolute;	/* Hides table head but not using display none */
		top:-1000em;
		left:-1000em;
	}
	.row{
		border:1px solid #eeeeee;
		border-top:2px solid #dddddd;
		border-bottom:2px solid #dddddd;
		margin:20px 0;
	}
	.row .column:nth-child(1){ /* first column of the row */
		border-left:none;
	}
	.row .column:last-child{ /* last column of the row */
		border-right:none;
	}
	.row:last-child .column,
	.column{ /* Column in the last row and column */
		border-bottom:1px solid #eeeeee;
	}
	.column:before{ /* prints the value of data-label attribute before the column data */
		font-weight:bold;
		padding-right:20px;
		font-size:12px;
		content:" "attr(data-label)" ";	/* call the attribute value of data-label and adds a string // */
	}
}