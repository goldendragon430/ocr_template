// @muiInvoiceCreateView

import { useState, useRef, useEffect, useCallback } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputBase from '@mui/material/InputBase';
import Scrollbar from 'src/components/scrollbar';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import Dialog, { dialogClasses } from '@mui/material/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import { IconButton, Checkbox } from '@mui/material';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Autocomplete from '@mui/material/Autocomplete';
import { useTheme } from '@emotion/react';
import { useBoolean } from 'src/hooks/use-boolean';
import { RecentWork } from './invoicetable';
import LoadingImg from './assets/loading.gif';
import EmptyImg from './assets/empty.svg';

import { Container, LeftWrapper, RightWrapper, ImageWrapper, HREFButton, ListItem } from './styles';
import { useWindowSize } from './utils/windowresize';

const InvoiceCreateView = () => {
  const [cookies] = useCookies(['companyId', 'username', 'name', 'apiKey']);
  const navigate = useNavigate();
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState({ x: 0, y: 0 });
  const [doc, setDoc] = useState('');
  // const [imgSize,setImgSize] = useState({width:0,height:0})
  const imageRef = useRef(null);
  const inputRef = useRef(null);
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState('');
  const [txt, setTxt] = useState('');
  const [extractedTxt, setExtractedTxt] = useState('');
  const [filename, setFileName] = useState('');
  const [emptyImg, setEmptyImg] = useState(EmptyImg);
  const [emptyString, setEmptyString] = useState('Please select Pdf File.');
  const [currentHandler, setCurrentHandler] = useState(() => null);
  const height = useWindowSize();
  const [tableId, setTableId] = useState(0);
  const [supplierList, setSupplierList] = useState([]);
  // ------------------For Text Field--------------------------//
  const [supplier, setSupplier] = useState('');
  const [code, setCode] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [memo, setMemo] = useState('');
  const [receiveDate, setReceiveDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [paymentBlock, setPaymentBlock] = useState('No Selected');
  const [paymentMethod, setPaymentMethod] = useState('No Selected');
  const [paymentAlone, setPaymentAlone] = useState(false);
  const [postDate, setPosteDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [amountDue, setAmountDue] = useState(0);
  const [currency, setCurrency] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');

  const [purchaseOrder, setPurchaseOrder] = useState('');
  const [glAccount, setGLAccount] = useState('');
  const [itemNumber, setItemNumber] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState('');
  const [unitPrice, setUnitPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [zoom, setZoom] = useState(1.0);
  const [tableData, setTableData] = useState([]);
  const [currentRow, setCurrentRow] = useState(-1);
  const [data, setData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [lineItemsData, setLineItemsData] = useState([]);
  const [currentField, setCurrentField] = useState('');
  const theme = useTheme();
  const search = useBoolean();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedResult, setSearchedResult] = useState([]);
  const [editMode, setEditMode] = useState(true);
  // -----------------For pagenation-----------------------------//
  const [page, setPage] = useState(0);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [pageState, setPageState] = useState(0); // 0 - ready 1 - uploading 2 - loading 3 - shwoing

  // -----------------Cookie Data-------------------------------//
  const [apikey, setApiKey] = useState('');
  const [companyId, setCompanyID] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const scrollPosition = window.scrollY || window.pageYOffset;
  const initializeData = async () => {
    if (!cookies?.companyId || !cookies?.apiKey || !cookies?.name || !cookies?.username) {
      navigate('/login');
    }
    setApiKey(cookies?.apiKey);
    setCompanyID(cookies?.companyId);
    const response = await axios.get(
      `https://ocrtest-api.azurewebsites.net/api/suppliers?apikey=${cookies?.apiKey}&companyid=${cookies?.companyId}`
    );
    const dd = response?.data;
    const vv = [];
    for (let i = 0; i < dd.length; i++) {
      vv.push({
        label: dd[i].supplier,
        number: dd[i].accountNumber,
        id: i,
      });
    }
    setSupplierList(vv);
    setSearchedResult(vv);
    /* ------------------Event Handler--------------------*/
    document.addEventListener('resetData', clearContent);
  };
  const fetchData = async (str) => {
    setFileName(str);
    setDoc(
      `https://ocrtest-api.azurewebsites.net/api/displayimage?apikey=${cookies?.apiKey}&companyid=${cookies?.companyId}&filename=${str}&page=1`
    );
    setPage(1);
    setPageState(3)
    // setTotalPageCount(1);
    const response = await axios.get(
      `https://ocrtest-api.azurewebsites.net/api/loadinvoice?apikey=${cookies?.apiKey}&companyid=${cookies?.companyId}&filename=${str}`
    );
    if (response?.data) {
      const result_data = response?.data;
      // console.log(result_data);

      // -----------------------Set Header-----------------------------//
      const temp = result_data?.header;

      for (let i = 0; i < temp.length; i++) {
        temp[i].filename = str;
        if (temp[i].uifield == 'supplier') {
          setSupplier(temp[i].extractedtext);
        } else if (temp[i].uifield == 'companycode') {
          setCode(temp[i].extractedtext);
        } else if (temp[i].uifield == 'invoicenumber') {
          setInvoiceNumber(temp[i].extractedtext);
        } else if (temp[i].uifield == 'invoicedate') {
          setInvoiceDate(temp[i].extractedtext);
        } else if (temp[i].uifield == 'memo') {
          setMemo(temp[i].extractedtext);
        } else if (temp[i].uifield == 'receiveddate') {
          setReceiveDate(temp[i].extractedtext);
        } else if (temp[i].uifield == 'paymentterms') {
          setPaymentTerms(temp[i].extractedtext);
        } else if (temp[i].uifield == 'postingdate') {
          setPosteDate(temp[i].extractedtext);
        } else if (temp[i].uifield == 'duedate') {
          setDueDate(temp[i].extractedtext);
        } else if (temp[i].uifield == 'amountdue') {
          setAmountDue(temp[i].extractedtext);
        } else if (temp[i].uifield == 'currency') {
          setCurrency(temp[i].extractedtext);
        } else if (temp[i].uifield == 'payalone') {
          if (temp[i].extractedtext.toLowerCase() == 'false') setPaymentAlone(false);
          else setPaymentAlone(true);
        } else if (temp[i].uifield == 'paymentblock') {
          if (temp[i].extractedtext != '') setPaymentBlock(temp[i].extractedtext);
        } else if (temp[i].uifield == 'paymentmethod') {
          if (temp[i].extractedtext != '') setPaymentMethod(temp[i].extractedtext);
        }
      }
      setData(temp);
      // --------------------Set Line Items-----------------------------//
      const lines = result_data?.lines;
      const table_data = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let table_id = '';
        let purchase_order = '';
        let gl_account = '';
        let item_number = '';
        let quantity = '';
        let description = '';
        let unit_price = '';
        let total_price = '';
        table_id = line[0].lineid;
        for (let j = 0; j < line.length; j++) {
          line[j].filename = str;
          line[j].companyid = cookies?.companyId;
          if (line[j].uifield == 'quantity') {
            quantity = line[j].confirmedtext;
          } else if (line[j].uifield == 'unitprice') {
            unit_price = line[j].confirmedtext;
          } else if (line[j].uifield == 'totalprice') {
            total_price = line[j].confirmedtext;
          } else if (line[j].uifield == 'glaccount') {
            gl_account = line[j].confirmedtext;
          } else if (line[j].uifield == 'description') {
            description = line[j].confirmedtext;
          } else if (line[j].uifield == 'itemnumber') {
            item_number = line[j].confirmedtext;
          } else if (line[j].uifield == 'purchaseorder') {
            purchase_order = line[j].confirmedtext;
          }
        }
        table_data.push(
          createData(
            table_id,
            purchase_order,
            gl_account,
            item_number,
            quantity,
            description,
            unit_price,
            total_price
          )
        );
      }
      setTableData(table_data);
      setLineItemsData(lines);
    }
  };
  useEffect(() => {
    initializeData();
    const documentUrl = window.location.href;
    const url = new URL(documentUrl);
    const searchParams = new URLSearchParams(url.search);
    const filenames = searchParams.get('filename');
    if (filenames) {
      fetchData(filenames);
      setEditMode(false);
    } else setEditMode(true);
  }, []);

  useEffect(() => {
    if (pageState == 1) {
      setEmptyImg(LoadingImg);
      setEmptyString('Uploading PDF...');
      setDoc('');
    }
    if (pageState == 2) {
      setEmptyString('Recognizing PDF...');
    }
  }, [pageState]);

  useEffect(() => {
    if (page > 0) {
      if (doc == '' && page == 1) {
        return;
      }
      setDoc(
        `https://ocrtest-api.azurewebsites.net/api/displayimage?apikey=${apikey}&companyid=${companyId}&filename=${filename}&page=${page}`
      );
    }
  }, [page]);
  useEffect(() => {
    const dd = supplierList.filter(
      (item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.number.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchedResult(dd);
  }, [searchQuery]);
  const ImageAnalysis = async (x, y, w, h) => {
    const pos = {
      x1: x,
      y1: y,
      x2: x + w,
      y2: y + h,
    };
    const result = await axios.post(
      `https://ocrtest-api.azurewebsites.net/api/extractdata?apikey=${apikey}&companyid=${companyId}&filename=${filename}&page=${page}`,
      pos
    );
    setTxt(result?.data?.extracteddata);
    setExtractedTxt(result?.data?.extracteddata);
    if (currentField === 'supplier') {
      setSearchQuery(result?.data?.extracteddata);
      search.onTrue();
    }
  };
  const uploadImgFile = async (filename, imageData) => {
    const content = {
      name: filename,
      data: imageData,
    };
    setPageState(1);
    const result = await axios.post(
      `https://ocrtest-api.azurewebsites.net/api/uploadfile?apikey=${apikey}&companyid=${companyId}`,
      content
    );

    if (result.data.success) {
      // toast.success('Successfully Uploaded.')
      setFileName(result?.data?.fileName);
      setTotalPageCount(result?.data?.pages);
      setPage(0);
      setPageState(2);
      console.log(result?.data?.fileName);
      getServerStatus(result?.data?.fileName);
    } else {
      toast.error('Uploading Error');
    }
  };

  const getServerStatus = async (filename) => {
    const result = await axios.get(
      `https://ocrtest-api.azurewebsites.net/api/filestatus?apikey=${apikey}&companyid=${companyId}&filename=${filename}`
    );
    if (result?.data?.status != 'Active') {
      setTimeout(() => {
        getServerStatus(filename);
      }, 1000);
    } else {
      // if (result?.data?.machinelearning != '') {
      //   const temp = JSON.parse(result?.data?.machinelearning);

      //   for (let i = 0; i < temp.length; i++) {
      //     temp[i].filename = filename;
      //     temp[i].confirmedtext = temp[i].extractedtext;

      //     if (temp[i].uifield == 'supplier') {
      //       setSupplier(temp[i].extractedtext);
      //     } else if (temp[i].uifield == 'companycode') {
      //       setCode(temp[i].extractedtext);
      //     } else if (temp[i].uifield == 'invoicenumber') {
      //       setInvoiceNumber(temp[i].extractedtext);
      //     } else if (temp[i].uifield == 'invoicedate') {
      //       setInvoiceDate(temp[i].extractedtext);
      //     } else if (temp[i].uifield == 'memo') {
      //       setMemo(temp[i].extractedtext);
      //     } else if (temp[i].uifield == 'receiveddate') {
      //       setReceiveDate(temp[i].extractedtext);
      //     } else if (temp[i].uifield == 'paymentterms') {
      //       setPaymentTerms(temp[i].extractedtext);
      //     } else if (temp[i].uifield == 'postingdate') {
      //       setPosteDate(temp[i].extractedtext);
      //     } else if (temp[i].uifield == 'duedate') {
      //       setDueDate(temp[i].extractedtext);
      //     } else if (temp[i].uifield == 'amountdue') {
      //       setAmountDue(temp[i].extractedtext);
      //     } else if (temp[i].uifield == 'currency') {
      //       setCurrency(temp[i].extractedtext);
      //     }
      //   }
      //   setData(temp);
      // }
      // setPageState(3);
      // setDoc(
      //   `https://ocrtest-api.azurewebsites.net/api/displayimage?apikey=${apikey}&companyid=${companyId}&filename=${filename}&page=1`
      // );
      // setPage(1);
      fetchData(filename)
    }
  };

  const handleInputChange = () => {
    const file = inputRef.current.files[0];
    if (file) {
      clearContent();
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        const imageData = e.target.result.replace('data:application/pdf;base64,', '');
        const filename = file.name;
        uploadImgFile(filename, imageData);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleMouseDown = (e) => {
    // // Set the mouse down state to true

    if (doc == '') return;

    // Store the initial position of the mouse click
    const { clientX, clientY } = e;
    if (clientY < 230) {
      return;
    }

    setIsMouseDown(true);
    setOpen(false);

    setStartPosition({ x: clientX, y: clientY });
    setEndPosition({ x: clientX, y: clientY });
  };

  const handleMouseMove = (e) => {
    // Check if the mouse is currently down
    if (isMouseDown) {
      // Update the end position of the rectangle
      const { clientX, clientY } = e;
      setEndPosition({ x: clientX, y: clientY });
    }
  };

  const handleMouseUp = (e) => {
    const { clientY } = e;
    // console.log(clientY);
    if (clientY < 230) {
      return;
    }
    if (doc == '') return;
    // // Set the mouse down state to false
    setIsMouseDown(false);

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const { naturalWidth, naturalHeight } = imageRef.current;
    const x_rate = naturalWidth / width;
    const y_rate = naturalHeight / height;

    const xx = Math.floor((startPosition.x - left) * x_rate);
    const yy = Math.floor((startPosition.y - top) * y_rate);
    const ww = Math.floor((endPosition.x - startPosition.x) * x_rate);
    const hh = Math.floor((endPosition.y - startPosition.y) * y_rate);
    const msg = `( ${xx}, ${yy}, ${xx + ww}, ${yy + hh})`;
    ImageAnalysis(xx, yy, ww, hh);
    setPos(msg);
    if (currentField === 'supplier') {
      return;
    }

    if (yy > 0) setOpen(true);
  };
  const addExtractedTxt = (field_name, supplier_d = '') => {
    const result = data.filter((item) => item?.uifield == field_name);
    if (result.length == 0) {
      // add new field
      setData([
        ...data,
        {
          filename,
          uifield: field_name,
          extractedcoordinates: pos.replace('(', '').replace(')', '').replaceAll(' ', ''),
          extractedtext: extractedTxt,
          confirmedtext: field_name === 'supplier' ? supplier : txt,
        },
      ]);
    } else {
      // update field
      result[0].extractedcoordinates = pos.replace('(', '').replace(')', '').replaceAll(' ', '');
      result[0].extractedtext = extractedTxt;
      result[0].confirmedtext = field_name === 'supplier' ? supplier_d : txt;
      setData(data);
    }
  };
  const changeExtractedTxt = (field_name, val) => {
    const result = data.filter((item) => item?.uifield == field_name);
    if (result.length > 0) {
      result[0].confirmedtext = val;
      setData(data);
    }
  };
  const addExtractedTxtForLineItems = (field_name) => {
    const result = lineData.filter((item) => item?.uifield == field_name);
    if (result.length == 0) {
      // add new field
      setLineData([
        ...lineData,
        {
          filename,
          uifield: field_name,
          extractedcoordinates: pos.replace('(', '').replace(')', '').replaceAll(' ', ''),
          extractedtext: extractedTxt,
          confirmedtext: txt,
        },
      ]);
    } else {
      // update field
      result[0].extractedcoordinates = pos.replace('(', '').replace(')', '').replaceAll(' ', '');
      result[0].extractedtext = extractedTxt;
      result[0].confirmedtext = txt;
      setLineData(data);
    }
  };
  const changeExtractedTxtForLineItems = (field_name, val) => {
    const result = lineData.filter((item) => item?.uifield == field_name);
    if (result.length > 0) {
      result[0].confirmedtext = val;
      setLineData(lineData);
    }
  };

  const onSetText = () => {
    setOpen(false);

    if (value == 0) addExtractedTxt(currentField);
    else {
      addExtractedTxtForLineItems(currentField);
    }
    if (currentHandler) {
      console.log(currentHandler(txt));
    }
    // navigator.clipboard.writeText(txt)
  };
  const clearContent = () => {
    setSupplier('');
    setCode('');
    setInvoiceNumber('');
    setInvoiceDate('');
    setMemo('');
    setReceiveDate('');
    setPaymentTerms('');
    setPosteDate('');
    setPaymentBlock('No Selected');
    setDueDate('');
    setPaymentMethod('No Selected');
    setAmountDue(0);
    setPaymentAlone(false);
    setCurrency('');
    setTableData([]);
    setPage(1);
    setTotalPageCount(1);
    setData([]);
    setCurrentField('');
    setTxt('');
    setPos('');
    setPageState(0);
    setExtractedTxt('');
    // setFileName('');
    setLineItemsData([]);
    onClear();
  };
  function createData(
    id,
    order,
    gl_account,
    item_number,
    quantity,
    description,
    unit_price,
    total_price
  ) {
    return {
      id,
      order,
      gl_account,
      item_number,
      quantity,
      description,
      unit_price,
      total_price,
    };
  }
  const onAdd = () => {
    if (unitPrice == '' || totalPrice == '' || quantity == '') {
      toast.error('Please check input value');
      return;
    }
    setTableData([
      ...tableData,
      createData(
        tableId,
        purchaseOrder,
        glAccount,
        itemNumber,
        quantity,
        description,
        unitPrice,
        totalPrice
      ),
    ]);
    setTableId(tableId + 1);
    const temp = [];
    for (let i = 0; i < lineData.length; i++) {
      temp.push({
        lineid: tableId,
        filename: lineData[i].filename,
        companyid: cookies?.companyId,
        uifield: lineData[i].uifield,
        extractedcoordinates: lineData[i].extractedcoordinates,
        extractedtext: lineData[i].extractedtext,
        confirmedtext: lineData[i].confirmedtext,
      });
    }
    setLineItemsData([...lineItemsData, temp]);
    console.log(lineData);
    onClear();
  };
  const onClear = () => {
    setPurchaseOrder('');
    setGLAccount('');
    setItemNumber('');
    setQuantity(0);
    setDescription('');
    setUnitPrice(0);
    setTotalPrice(0);
    setLineData([]);
    setCurrentRow(-1);
  };

  const onSelectRow = (data_id) => {
    setCurrentRow(data_id);
    const item = tableData.filter((item) => item.id == data_id);

    if (item.length > 0) {
      setPurchaseOrder(item[0].order);
      setGLAccount(item[0].gl_account);
      setItemNumber(item[0].item_number);
      setQuantity(item[0].quantity);
      setDescription(item[0].description);
      setUnitPrice(item[0].unit_price);
      setTotalPrice(item[0].total_price);
    }
    const itemsData = lineItemsData.filter((item) => item[0].lineid == data_id);
    const tt = [];
    if (itemsData.length > 0) {
      const filteredlineData = itemsData[0];
      for (let i = 0; i < filteredlineData.length; i++) {
        tt.push({
          filename: filteredlineData[i].filename,
          uifield: filteredlineData[i].uifield,
          extractedcoordinates: filteredlineData[i].extractedcoordinates,
          extractedtext: filteredlineData[i].extractedtext,
          confirmedtext: filteredlineData[i].confirmedtext,
        });
      }
    }
    setLineData(tt);
  };
  const onZoomIn = () => {
    if (zoom < 2) setZoom((prev) => prev + 0.1);
  };
  const onZoomOut = () => {
    if (zoom > 0.5) setZoom((prev) => prev - 0.1);
  };
  const onFirstPage = () => {
    setPage(1);
  };
  const onLastPage = () => {
    setPage(totalPageCount);
  };
  const onPrevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const onNextPage = () => {
    if (page < totalPageCount) {
      setPage(page + 1);
    }
  };
  const onDelete = async () => {
    if (currentRow >= 0) {
      if (confirm('Do you really delete this row?')) {
        const newTableData = tableData.filter((item) => item.id != currentRow);
        setTableData(newTableData);
        const newLineItemsData = lineItemsData.filter((item) => item[0].lineid != currentRow);
        setLineItemsData(newLineItemsData);
      }
    }
  };
  const onSaveChange = async () => {
    // ----------------Table Data--------------------//
    const newLineItemsData = Array.from(lineItemsData);

    for (let i = 0; i < newLineItemsData.length; i++) {
      if (newLineItemsData[i][0].lineid == currentRow) {
        const temp = [];
        for (let i = 0; i < lineData.length; i++) {
          temp.push({
            filename: lineData[i].filename,
            companyid: cookies?.companyId,
            uifield: lineData[i].uifield,
            extractedcoordinates: lineData[i].extractedcoordinates,
            extractedtext: lineData[i].extractedtext,
            confirmedtext: lineData[i].confirmedtext,
          });
        }
        newLineItemsData[i] = temp;
        break;
      }
    }
    setLineItemsData(newLineItemsData);

    let newTableData = [];
    newTableData = Array.from(tableData);
    // ---------------Table Row------------------------//
    for (let i = 0; i < newTableData.length; i++) {
      if (newTableData[i].id == currentRow) {
        newTableData[i].order = purchaseOrder;
        newTableData[i].gl_account = glAccount;
        newTableData[i].item_number = itemNumber;
        newTableData[i].quantity = quantity;
        newTableData[i].description = description;
        newTableData[i].unit_price = unitPrice;
        newTableData[i].total_price = totalPrice;
        break;
      }
    }
    setTableData(newTableData);
  };
  const paymentBlockList = [
    { label: 'No Selected', id: 0 },
    { label: 'GR Issue', id: 1 },
    { label: 'Unit Price', id: 2 },
  ];
  const paymentMethodList = [
    { label: 'No Selected', id: 0 },
    { label: 'Check', id: 1 },
    { label: 'ACH', id: 2 },
  ];
  const onSave = async () => {
    const request_data = [
      ...data,
      {
        filename,
        uifield: 'paymentblock',
        extractedcoordinates: '',
        extractedtext: paymentBlock,
        confirmedtext: paymentBlock,
      },
      {
        filename,
        uifield: 'paymentmethod',
        extractedcoordinates: '',
        extractedtext: paymentMethod,
        confirmedtext: paymentMethod,
      },
      {
        filename,
        uifield: 'payalone',
        extractedcoordinates: '',
        extractedtext: paymentAlone ? 'Yes' : 'No',
        confirmedtext: paymentAlone ? 'Yes' : 'No',
      },
    ];
    try {
      await axios.post(
        `https://ocrtest-api.azurewebsites.net/api/savemachinelearning?apikey=${cookies?.apiKey}&companyid=${cookies?.companyId}`,
        request_data
      );
      await axios.post(
        `https://ocrtest-api.azurewebsites.net/api/savemachinelearninglines?apikey=${cookies?.apiKey}&companyid=${cookies?.companyId}`,
        lineItemsData
      );
      onStatusSend('In Process');
    } catch (err) {
      toast.error('Error');
      console.log(err);
    }
  };
  const onReset = async () => {
    clearContent();
  };
  const onExtract = async () => {
    if (unitPrice == '' || totalPrice == '' || quantity == '' || lineData.length != 7) {
      toast.error('Please check input value');
    }
    const temp = {};
    for (let i = 0; i < lineData.length; i++) {
      if (lineData[i]?.extractedcoordinates == '') return;
      temp[`${lineData[i]?.uifield}`] = lineData[i]?.extractedcoordinates;
    }
    const response = await axios.post(
      `https://ocrtest-api.azurewebsites.net/api/extractdatalines?apikey=${cookies?.apiKey}&companyid=${cookies?.companyId}&filename=${filename}`,
      temp
    );
    const pdata = response?.data;
    const first_row_data = [];
    for (let i = 0; i < lineData.length; i++) {
      first_row_data.push({
        lineid: 1,
        filename: lineData[i].filename,
        companyid: cookies?.companyId,
        uifield: lineData[i].uifield,
        extractedcoordinates: lineData[i].extractedcoordinates,
        extractedtext: lineData[i].extractedtext,
        confirmedtext: lineData[i].confirmedtext,
      });
    }
    const first_table_row = createData(
      1,
      purchaseOrder,
      glAccount,
      itemNumber,
      quantity,
      description,
      unitPrice,
      totalPrice
    );
    const mid_table_data = [first_table_row];
    for (let i = 0; i < pdata.length; i++) {
      const _quantity = pdata[i][0].confirmedtext;
      const _purchaseOrder = pdata[i][3].confirmedtext;
      const _glAccount = pdata[i][6].confirmedtext;
      const _itemNumber = pdata[i][4].confirmedtext;
      const _description = pdata[i][5].confirmedtext;
      const _totalPrice = pdata[i][2].confirmedtext;
      const _unitPrice = pdata[i][1].confirmedtext;
      mid_table_data.push(
        createData(
          i + 2,
          _purchaseOrder,
          _glAccount,
          _itemNumber,
          _quantity,
          _description,
          _unitPrice,
          _totalPrice
        )
      );
    }
    setTableId(pdata.length + 2);
    setTableData(mid_table_data);
    setLineItemsData([first_row_data].concat(pdata));
  };
  const onStatusSend = async (status) => {
    // post => Posted, save => In Process, on Hold => On Hold, reject => Rejected

    const tableDataForSend = [];
    for (let i = 0; i < tableData.length; i++) {
      tableDataForSend.push({
        lineid: tableData[i].id,
        purchaseorder: tableData[i].order,
        glaccount: tableData[i].gl_account,
        itemnumber: tableData[i].item_number,
        quantity: tableData[i].quantity,
        unitprice: tableData[i].unit_price,
        totalprice: tableData[i].total_price,
        description: tableData[i].description,
      });
    }
    const request_data = {
      companyid: cookies?.companyId,
      filename,
      status,
      supplier,
      companycode: code,
      invoicenumber: invoiceNumber,
      memo,
      paymentterms: paymentTerms,
      paymentblock: paymentBlock,
      paymentmethod: paymentMethod,
      payalone: paymentAlone,
      invoicedate: invoiceDate,
      receiveddate: receiveDate,
      postingdate: postDate,
      duedate: dueDate,
      amountdue: amountDue,
      currency,
      lines: tableDataForSend,
    };
    try {
      await axios.post(
        `https://ocrtest-api.azurewebsites.net/api/saveinvoice?apikey=${cookies?.apiKey}&companyid=${cookies?.companyId}`,
        request_data
      );

      toast.success('Success');
      document.location.href = '/dashboard/invoice';
    } catch (err) {
      toast.error('Error');
      console.log(err);
    }
  };

  const onSetSupplier = useCallback(
    (str) => {
      setSupplier(str);
      addExtractedTxt('supplier', str);
      setSearchQuery('');
      search.onFalse();
    },
    [search]
  );
  return (
    <div style={{ height: height - 130, width: '100%', minWidth: 1280 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 34 }}> AI Invoice Recognition</h1>
        <div style={{ display: 'flex' }}>
          <Button
            variant="contained"
            color="primary"
            style={{ margin: 10, height: 40, marginRight: 10 }}
            onClick={() => onStatusSend('Posted')}
          >
            Post
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ margin: 10, height: 40, marginRight: 10 }}
            onClick={onSave}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ margin: 10, height: 40, marginRight: 10 }}
            onClick={() => onStatusSend('On Hold')}
          >
            On Hold
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ margin: 10, height: 40, marginRight: 10 }}
            onClick={() => onStatusSend('Rejected')}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="error"
            style={{ margin: 10, height: 40, marginRight: 10 }}
            onClick={onReset}
          >
            Cancel
          </Button>
        </div>
      </div>
      <Container>
        <LeftWrapper
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          //  onMouseLeave = {handleMouseUp}
        >
          <div style={{ width: '100%', background: '#3f51b5', color: 'white' }}>
            <Toolbar style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex' }}>
                <p>Zoom</p>
                <IconButton aria-label="add" onClick={onZoomIn}>
                  <AddIcon style={{ color: 'white' }} />
                </IconButton>
                <IconButton aria-label="remote" onClick={onZoomOut}>
                  <RemoveIcon style={{ color: 'white' }} />
                </IconButton>
              </div>
              <div style={{ display: 'flex' }}>
                <IconButton aria-label="first">
                  <FirstPageIcon style={{ color: 'white' }} onClick={onFirstPage} />
                </IconButton>
                <IconButton aria-label="before">
                  <NavigateBeforeIcon style={{ color: 'white' }} onClick={onPrevPage} />
                </IconButton>
                <select
                  style={{ outline: 'initial' }}
                  onChange={(e) => setPage(e.target.value)}
                  value={page}
                >
                  {[...Array(totalPageCount)].map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      Page {index + 1} / {totalPageCount}
                    </option>
                  ))}
                </select>
                <IconButton aria-label="next">
                  <NavigateNextIcon style={{ color: 'white' }} onClick={onNextPage} />
                </IconButton>
                <IconButton aria-label="last">
                  <LastPageIcon style={{ color: 'white' }} onClick={onLastPage} />
                </IconButton>
              </div>

              <Button
                color="inherit"
                onClick={() => {
                  inputRef.current.click();
                }}
              >
                <input
                  style={{ display: 'none' }}
                  type="file"
                  ref={inputRef}
                  onChange={handleInputChange}
                  accept="application/pdf"
                />
                Select Image
              </Button>
            </Toolbar>
          </div>
          {doc ? (
            <div
              className="imageContainer"
              style={{ maxWidth: 750, overflow: 'auto', height: height - 350 }}
            >
              <ImageWrapper src={doc} ref={imageRef} style={{ maxWidth: 700 * zoom }} />
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <div style={{ display: 'grid', justifyItems: 'center' }}>
                <img src={emptyImg} />
                <h2> {emptyString}</h2>
              </div>
            </div>
          )}
          {isMouseDown && (
            <div
              style={{
                position: 'absolute',
                top: Math.min(startPosition.y, endPosition.y) + scrollPosition,
                left: Math.min(startPosition.x, endPosition.x),
                width: Math.abs(endPosition.x - startPosition.x),
                height: Math.abs(endPosition.y - startPosition.y),
                border: '1px solid red',
                backgroundColor: 'transparent',
              }}
            />
          )}
        </LeftWrapper>
        <RightWrapper>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Header" aria-controls="tab-body2" id="tab-2" />
                <Tab label="Line Items" aria-controls="tab-body3" id="tab-3" />
              </Tabs>
            </Box>

            <Box
              id="tab-body2"
              hidden={value !== 0}
              aria-labelledby="tab-2"
              style={{ textAlign: 'left', paddingLeft: 30, maxWidth: 490, marginLeft: 100 }}
            >
              <div style={{ display: 'block', marginTop: 30 }}>
                <TextField
                  id="standard-helperText"
                  label="Supplier"
                  defaultValue=""
                  variant="standard"
                  style={{ margin: 10, marginRight: 30 }}
                  value={supplier}
                  onChange={(e) => {
                    setSupplier(e.target.value);
                    changeExtractedTxt('supplier', e.target.value);
                  }}
                  onFocus={() => {
                    setCurrentHandler(() => (msg) => {
                      setSupplier(msg);
                    });
                    setCurrentField('supplier');
                  }}
                />

                <TextField
                  id="standard-helperText2"
                  label="Company Code"
                  defaultValue=""
                  variant="standard"
                  style={{ margin: 10 }}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    changeExtractedTxt('companycode', e.target.value);
                  }}
                  onFocus={() => {
                    setCurrentHandler(() => (msg) => {
                      setCode(msg);
                    });
                    setCurrentField('companycode');
                  }}
                />

                <TextField
                  id="standard-helperText3"
                  label="Invoice Number"
                  defaultValue=""
                  variant="standard"
                  style={{ margin: 10, marginRight: 30 }}
                  value={invoiceNumber}
                  onChange={(e) => {
                    setInvoiceNumber(e.target.value);
                    changeExtractedTxt('invoicenumber', e.target.value);
                  }}
                  onFocus={() => {
                    setCurrentHandler(() => (msg) => setInvoiceNumber(msg));
                    setCurrentField('invoicenumber');
                  }}
                />
                <TextField
                  id="standard-helperText4"
                  label="Invoice Date"
                  defaultValue=""
                  variant="standard"
                  style={{ margin: 10 }}
                  value={invoiceDate}
                  onChange={(e) => {
                    setInvoiceDate(e.target.value);
                    changeExtractedTxt('invoicedate', e.target.value);
                  }}
                  onFocus={() => {
                    setCurrentHandler(() => (msg) => {
                      setInvoiceDate(msg);
                    });
                    setCurrentField('invoicedate');
                  }}
                />
                <TextField
                  id="standard-helperText5"
                  label="Memo"
                  defaultValue=""
                  variant="standard"
                  style={{ margin: 10, marginRight: 30 }}
                  value={memo}
                  onChange={(e) => {
                    setMemo(e.target.value);
                    changeExtractedTxt('memo', e.target.value);
                  }}
                  onFocus={() => {
                    setCurrentHandler(() => (msg) => {
                      setMemo(msg);
                    });
                    setCurrentField('memo');
                  }}
                />
                <TextField
                  id="standard-helperText6"
                  label="Receive Date"
                  defaultValue=""
                  variant="standard"
                  style={{ margin: 10 }}
                  value={receiveDate}
                  onChange={(e) => {
                    setReceiveDate(e.target.value);
                    changeExtractedTxt('receiveddate', e.target.value);
                  }}
                  onFocus={() => {
                    setCurrentHandler(() => (msg) => {
                      setReceiveDate(msg);
                    });
                    setCurrentField('receiveddate');
                  }}
                />
                <TextField
                  id="standard-helperText7"
                  label="Payment Terms"
                  defaultValue=""
                  variant="standard"
                  style={{ margin: 10, marginRight: 30 }}
                  value={paymentTerms}
                  onChange={(e) => {
                    setPaymentTerms(e.target.value);
                    changeExtractedTxt('paymentterms', e.target.value);
                  }}
                  onFocus={() => {
                    setCurrentHandler(() => (msg) => {
                      setPaymentTerms(msg);
                    });
                    setCurrentField('paymentterms');
                  }}
                />
                <TextField
                  id="standard-helperText8"
                  label="Posting Date"
                  defaultValue=""
                  variant="standard"
                  style={{ margin: 10 }}
                  value={postDate}
                  onChange={(e) => {
                    setPosteDate(e.target.value);
                    changeExtractedTxt('postingdate', e.target.value);
                  }}
                  onFocus={() => {
                    setCurrentHandler(() => (msg) => {
                      setPosteDate(msg);
                    });
                    setCurrentField('postingdate');
                  }}
                />
                <div style={{ display: 'flex' }}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={paymentBlockList}
                    style={{ width: '40%', margin: 10, marginRight: 30, marginLeft: 0 }}
                    renderInput={(params) => <TextField {...params} label="Payment Block" />}
                    onChange={(ev, newValue) => {
                      setPaymentBlock(newValue.label);
                    }}
                    value={paymentBlock}
                  />
                  <TextField
                    id="standard-helperText9"
                    label="Due Date"
                    defaultValue=""
                    variant="standard"
                    style={{ margin: 10 }}
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      changeExtractedTxt('duedate', e.target.value);
                    }}
                    onFocus={() => {
                      setCurrentHandler(() => (msg) => {
                        setDueDate(msg);
                      });
                      setCurrentField('duedate');
                    }}
                  />
                </div>
                <div style={{ display: 'flex' }}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={paymentMethodList}
                    style={{ width: '40%', margin: 10, marginRight: 30, marginLeft: 0 }}
                    renderInput={(params) => <TextField {...params} label="Payment Method" />}
                    onChange={(ev, newValue) => {
                      setPaymentMethod(newValue.label);
                    }}
                    value={paymentMethod}
                  />
                  <TextField
                    id="standard-helperText10"
                    label="Amount Due"
                    defaultValue=""
                    variant="standard"
                    style={{ margin: 10 }}
                    type="text"
                    value={amountDue}
                    onChange={(e) => {
                      setAmountDue(e.target.value);
                      changeExtractedTxt('amountdue', e.target.value);
                    }}
                    onFocus={() => {
                      setCurrentHandler(() => (msg) => {
                        setAmountDue(msg);
                      });
                      setCurrentField('amountdue');
                    }}
                  />
                </div>
                <div style={{ display: 'flex' }}>
                  <div
                    className="paymentAloneWrapper"
                    style={{ display: 'flex', alignItems: 'center', width: '40%', marginRight: 25 }}
                  >
                    <Checkbox
                      checked={paymentAlone}
                      onChange={() => setPaymentAlone(!paymentAlone)}
                      name="checkedB"
                      color="primary"
                    />
                    <p> Pay Alone</p>
                  </div>

                  <TextField
                    id="standard-helperText11"
                    label="Currency"
                    defaultValue=""
                    variant="standard"
                    style={{ margin: 10 }}
                    value={currency}
                    onChange={(e) => {
                      setCurrency(e.target.value);
                      changeExtractedTxt('currency', e.target.value);
                    }}
                    onFocus={() => {
                      setCurrentHandler(() => (msg) => {
                        setCurrency(msg);
                      });
                      setCurrentField('currency');
                    }}
                  />
                </div>
              </div>
            </Box>
            <Box
              id="tab-body3"
              hidden={value !== 1}
              aria-labelledby="tab-3"
              style={{ textAlign: 'left', paddingLeft: 0 }}
            >
              <div style={{ display: 'block', marginTop: 30 }}>
                <TextField
                  id="standard-helperText12"
                  label="Purchase Order"
                  defaultValue=""
                  variant="standard"
                  style={{ margin: 10 }}
                  value={purchaseOrder}
                  onChange={(e) => {
                    setPurchaseOrder(e.target.value);
                    changeExtractedTxtForLineItems('purchaseorder', e.target.value);
                  }}
                  onFocus={() => {
                    setCurrentHandler(() => (msg) => {
                      setPurchaseOrder(msg);
                    });
                    setCurrentField('purchaseorder');
                  }}
                />
                <TextField
                  id="standard-helperText13"
                  label="GL Account"
                  defaultValue=""
                  variant="standard"
                  style={{ margin: 10 }}
                  value={glAccount}
                  onChange={(e) => {
                    setGLAccount(e.target.value);
                    changeExtractedTxtForLineItems('glaccount', e.target.value);
                  }}
                  onFocus={() => {
                    setCurrentHandler(() => (msg) => setGLAccount(msg));
                    setCurrentField('glaccount');
                  }}
                />
                <TextField
                  id="standard-helperText14"
                  label="Item Number"
                  defaultValue=""
                  variant="standard"
                  style={{ margin: 10 }}
                  value={itemNumber}
                  onChange={(e) => {
                    setItemNumber(e.target.value);
                    changeExtractedTxtForLineItems('itemnumber', e.target.value);
                  }}
                  onFocus={() => {
                    setCurrentHandler(() => (msg) => setItemNumber(msg));
                    setCurrentField('itemnumber');
                  }}
                />
                <TextField
                  id="standard-helperText"
                  label="Quantity"
                  defaultValue=""
                  variant="standard"
                  style={{ margin: 10 }}
                  value={quantity}
                  type="text"
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    changeExtractedTxtForLineItems('quantity', e.target.value);
                  }}
                  onFocus={() => {
                    setCurrentHandler(() => (msg) => setQuantity(msg));
                    setCurrentField('quantity');
                  }}
                />
                <TextField
                  id="standard-helperText"
                  label="Unit Price"
                  defaultValue=""
                  variant="standard"
                  style={{ margin: 10 }}
                  value={unitPrice}
                  type="text"
                  onChange={(e) => {
                    setUnitPrice(e.target.value);
                    changeExtractedTxtForLineItems('unitprice', e.target.value);
                  }}
                  onFocus={() => {
                    setCurrentHandler(() => (msg) => setUnitPrice(msg));
                    setCurrentField('unitprice');
                  }}
                />
                <TextField
                  id="standard-helperText"
                  label="Total Price"
                  defaultValue=""
                  variant="standard"
                  style={{ margin: 10 }}
                  value={totalPrice}
                  type="text"
                  onChange={(e) => {
                    setTotalPrice(e.target.value);
                    changeExtractedTxtForLineItems('totalprice', e.target.value);
                  }}
                  onFocus={() => {
                    setCurrentHandler(() => (msg) => setTotalPrice(msg));
                    setCurrentField('totalprice');
                  }}
                />
                <TextField
                  id="standard-helperText"
                  label="Description"
                  defaultValue=""
                  variant="standard"
                  style={{ margin: 10, minWidth: 250 }}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    changeExtractedTxtForLineItems('description', e.target.value);
                  }}
                  onFocus={() => {
                    setCurrentHandler(() => (msg) => setDescription(msg));
                    setCurrentField('description');
                  }}
                />
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ margin: 20, marginRight: 5 }}
                    onClick={onAdd}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ margin: 20, marginRight: 5 }}
                    onClick={onSaveChange}
                  >
                    Save Change
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    style={{ margin: 20, marginRight: 0 }}
                    onClick={onClear}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ margin: 20, marginRight: 5 }}
                    onClick={onDelete}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ margin: 20, marginRight: 5 }}
                    onClick={onExtract}
                  >
                    Extract Lines
                  </Button>
                </div>
              </div>
              <RecentWork rows={tableData} onSelect={onSelectRow} />
            </Box>
          </Box>
        </RightWrapper>
      </Container>
      <Box
        sx={{
          boxShadow:
            'rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px',
          width: 200,
          height: 100,
          position: 'absolute',
          left: Math.min(startPosition.x, endPosition.x),
          top: Math.min(startPosition.y, endPosition.y) + scrollPosition + 20,
          display: open ? 'block' : 'none',
          background: 'white',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <TextField
            id="standard-helperText2"
            defaultValue=""
            variant="standard"
            style={{ margin: 7, textAlign: 'center', fontSize: 10, minFontSize: 10 }}
            value={txt}
            onChange={(e) => setTxt(e.target.value)}
          />
          <p style={{ fontSize: 14, margin: 0 }}>{pos}</p>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
            <HREFButton style={{ marginLeft: 10 }} onClick={onSetText}>
              Set Text
            </HREFButton>
            <HREFButton style={{ marginRight: 10 }} onClick={() => setOpen(false)}>
              Close
            </HREFButton>
          </div>
        </div>
      </Box>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={search.value}
        onClose={() => {
          setSearchQuery('');
          search.onFalse();
        }}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: 0,
        }}
        PaperProps={{
          sx: {
            mt: 15,
            overflow: 'unset',
          },
        }}
        sx={{
          [`& .${dialogClasses.container}`]: {
            alignItems: 'flex-start',
          },
        }}
      >
        <Box sx={{ p: 3, borderBottom: `solid 1px ${theme.palette.divider}` }}>
          <InputBase
            fullWidth
            autoFocus
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            inputProps={{
              sx: { typography: 'h6' },
            }}
          />
        </Box>

        <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>
          <table style={{ width: '100%' }}>
            {searchedResult.map((item, index) => (
              <ListItem key={index} onClick={() => onSetSupplier(item.label)}>
                <td>{item.number}</td>
                <td style={{ textAlign: 'center' }}>{item.label}</td>
              </ListItem>
            ))}
          </table>
        </Scrollbar>
      </Dialog>
    </div>
  );
};
export default InvoiceCreateView;
