import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@mui/material/Typography';
import * as ReactDOM from 'react-dom';

import DeleteIcon from '@material-ui/icons/Delete';
import drawerWidth from '../globalData'
import axios from 'axios';

import Pagination from '@mui/material/Pagination';
import { format } from "date-fns";
import { TextField } from '@mui/material';

// 弹窗
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            // color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

function createData(turnoverNumber, customerCode, terminalCode, turnoverState, turnoverType,founders,createTime,operation) {
    return { turnoverNumber, customerCode, terminalCode, turnoverState, turnoverType,founders,createTime,operation};
  }
function turnState(flag){
  if(flag){
    return <Button variant="outlined" color="primary">进行中</Button>
  }else{
    return <Button variant="outlined">完成</Button>
  }
}

const ondelete = async () =>{
  console.log('here');
  const res = await axios.get('/api/management/transdelete/'+'RT2022080700001');
  alert(JSON.stringify(res.data));
}

// 周转类型的判断
function operationState(flag){
  if(flag){
    return (
      <div>
        <Button variant="outlined" color="secondary" onClick={ondelete}>取消</Button>&emsp;
        <Button variant="outlined">完成周转</Button>
      </div>
      )
  }else{
    return ''
  }
}


  const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  }));

  const trans = () => {
    // 选项卡
    const [value, setValue] = React.useState({
      transId:'',
      customerSelect: '',
      terminalSelect: '',
      turnoverTypeSelect: '',
      turnoverCodeSelect: []
    });

    // 按钮组件
    const classes = useStyles();
    // 弹窗
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    
    //换页
    const [page, setPage] = React.useState(1);
    const pageNumberOnChange=(event,value)=>{
      console.log(value)
      setPage(value)
    }

    const handleChange = (prop) => (event) => {
      setValue({ ...value, [prop]: event.target.value });
    };

    const getDate = () =>{
      const today = new Date();

      //const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() +' '+ today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
      let date = '';
      date = format(today, "MMMM do, yyyy H:mma");

      return date;
    }

    const search = async () => {
      const processPer = await axios.get('/api/auth/currentuser');
      if(processPer.data.currentUser === null)
      {
              alert('请登录账号');
      }
      else{

        const transId = document.getElementById('StransId').value;
        const customerId = document.getElementById('ScustomerSelect').innerText;
        const termId = document.getElementById('SterminalSelect').innerText;
        const transStateString = document.getElementById('SturnoverStateSelect').innerText;
        const transType = document.getElementById('SturnoverTypeSelect').innerText;

        //console.log(transStateString);

        const transState = (transStateString === '进行中' ? true : transStateString === '完成' ? false : null);
    
        const all = await axios.post('/api/management/transdownload',{
          processPer: processPer.data.currentUser.email
        });
    
        console.log(processPer.data.currentUser.email);
        console.log(customerId);
        const alltrans = [];
    
        for(const tran of all.data.allTrans)
        {
          if(
            (transId === '' || transId === tran.transId) &&
            (customerId || customerId === tran.customerId) &&
            (termId || termId === tran.termId) &&
            (transState === null || transState === tran.transState) &&
            (transType || transType === tran.transType)
            )
          {
            alltrans.push(createData(tran.transId,tran.customerId,tran.termId,tran.transState,tran.transType,tran.processPer,tran.createTime,true));
          }
        }
    
        const element = document.getElementById('all_trans');
    
        ReactDOM.render(alltrans.map((row) => (
          <TableRow
            key={row.name}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
            {<Button id={row.turnoverNumber} variant="outlined">{row.turnoverNumber}</Button>}
            </TableCell>
            <TableCell align="center">{row.customerCode}</TableCell>
            <TableCell align="center">{row.terminalCode}</TableCell>
            <TableCell align="center">{turnState(row.turnoverState)}</TableCell>
            <TableCell align="center">{row.turnoverType}</TableCell>
            <TableCell align="center">{row.founders}</TableCell>
            <TableCell align="center">{row.createTime}</TableCell>
            <TableCell align="center">{operationState(row.operation)}</TableCell>
          </TableRow>
        )), element);
      }
    }
  
  const onSubmit = async (event) => {
  
          event.preventDefault();
  
          const transId = value.transId;
          const customerSelect = value.customerSelect;
          const terminalSelect = value.terminalSelect;
          const turnoverTypeSelect = value.turnoverTypeSelect;
          const turnoverCodeSelect = value.turnoverCodeSelect;
          const processObj = await axios.get('/api/auth/currentuser');

          if(processObj.data.currentUser === null)
          {
            alert('请登录账号');

            setValue({...value,
              transId:'',
              customerSelect:'',
              terminalSelect:'',
              turnoverTypeSelect:'',
              turnoverCodeSelect: []
          });
          }
          else if(transId === '' ||
            customerSelect === '' ||
            terminalSelect === '' ||
            turnoverTypeSelect === '' ||
            turnoverCodeSelect === [])
          {
            alert('请填写所有周转单信息');

            setValue({...value,
              transId:'',
              customerSelect:'',
              terminalSelect:'',
              turnoverTypeSelect:'',
              turnoverCodeSelect: []
          });
          }
          else{
  
            try{
                const processPer = processObj.data.currentUser.email;
                const currentDate = getDate();

                //alert(currentDate);

                await axios.post('/api/management/transupload', {
                  transId: transId,
                  customerId: customerSelect,
                  termId: terminalSelect,
                  transState: true,
                  transType: turnoverTypeSelect,
                  processPer: processPer,
                  createTime: currentDate
                })

                setValue({...value,
                  transId:'',
                  customerSelect:'',
                  terminalSelect:'',
                  turnoverTypeSelect:'',
                  processPer:''
              });
      
                search();
                setOpen(false);
                //success upload
            } 
            catch (err) {
                value.errors = err.response.data.errors;
                alert(JSON.stringify(value.errors));
            }
          }
  }
  

  let boxNo = 0;

  const newBox =()=>{

    const element = document.getElementById('transboxes');

    let tmp = [];
    boxNo ++;
    console.log(boxNo);
    for (let i = 0; i < boxNo; i++) {
      tmp.push(i);
    }

    ReactDOM.render(tmp.map((res)=>
    <TableRow id={res}>                                                        
    <TableCell>
    <Select labelId="turnoverCodeLabel" id={'turnoverCodeSelect'+res} onChange={handleBoxChange('code',res)} style={{width: '100%' }} >
      <MenuItem value="EU_HB_00001">EU_HB_00001</MenuItem>
      <MenuItem value="EU_AH_00001">EU_AH_00001</MenuItem>
      <MenuItem value="EU_AH_00002">EU_AH_00002</MenuItem>
      <MenuItem value="EU_NMG_00001">EU_NMG_00001</MenuItem>
      <MenuItem value="EU_BJ_00001">EU_BJ_00001</MenuItem>
      <MenuItem value="EU_SC_00001">EU_SC_00001</MenuItem>
      <MenuItem value="EU_SH_00001">EU_SH_00001</MenuItem>
      <MenuItem value="EU_HN_00001">EU_HN_00001</MenuItem>
      <MenuItem value="EU_AH_00003">EU_AH_00003</MenuItem>
      <MenuItem value="EU_AH_00004">EU_AH_00004</MenuItem>
      </Select>
    </TableCell>  
    <TableCell>
      <TextField margin="normal" inputProps={{ inputMode: 'numeric', pattern: '[1-9]*' }} onChange={handleBoxChange('amount',res)} style={{width: '50%' }}/>
    </TableCell>
    <TableCell>
    <IconButton aria-label="delete">
      <DeleteIcon />
    </IconButton>
    </TableCell>
    </TableRow>
    )
    ,element);
  }

    return (
      <div style={{width: `calc(100% - ${drawerWidth}px)`,
        height: 'calc(100% - 64px)',
        marginLeft: ` ${drawerWidth}px`,
        marginTop: '64px'}}>
        <br></br>
        <div component={Paper}>
          <Paper square>
            <Tabs
              value={value}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChange}
              aria-label="disabled tabs example">
              <Tab label="周转单管理" />
            </Tabs>
            <div>
              <br></br>
              <span className='boxStyle'>
                &emsp;&emsp;&emsp;&emsp;周转单号:&emsp;&emsp;&emsp;&emsp;
              </span>
              <span>
                <Input placeholder="请输入周转单号" id="StransId"  inputProps={{ 'aria-label': 'description' }} style={{width: '10%' }}/>
              </span>
              <span>
                &emsp;&emsp;&emsp;&emsp;客户代码:&emsp;&emsp;&emsp;&emsp;
              </span>
              <span>
                <Select labelId="customerLabel" id="ScustomerSelect" style={{width: '10%' }}>
                  <MenuItem value="CU_JS00001">CU_JS00001</MenuItem>
                  <MenuItem value="CU_JS00002">CU_JS00002</MenuItem>
                  <MenuItem value="CU_JS00003">CU_JS00003</MenuItem>
                  <MenuItem value="CU_JS00004">CU_JS00004</MenuItem>
                  <MenuItem value="CU_JS00005">CU_JS00005</MenuItem>
                  <MenuItem value="CU_JS00006">CU_JS00006</MenuItem>
                </Select>
              </span>
              <span>
                &emsp;&emsp;&emsp;&emsp;终端代码:&emsp;&emsp;&emsp;&emsp;
              </span>
              <span>
                <Select labelId="terminalLabel" id="SterminalSelect" style={{width: '10%' }} >
                  <MenuItem value="EU_HB_00001">EU_HB_00001</MenuItem>
                  <MenuItem value="EU_AH_00001">EU_AH_00001</MenuItem>
                  <MenuItem value="EU_AH_00002">EU_AH_00002</MenuItem>
                  <MenuItem value="EU_NMG_00001">EU_NMG_00001</MenuItem>
                  <MenuItem value="EU_BJ_00001">EU_BJ_00001</MenuItem>
                  <MenuItem value="EU_SC_00001">EU_SC_00001</MenuItem>
                  <MenuItem value="EU_SH_00001">EU_SH_00001</MenuItem>
                  <MenuItem value="EU_HN_00001">EU_HN_00001</MenuItem>
                  <MenuItem value="EU_AH_00003">EU_AH_00003</MenuItem>
                  <MenuItem value="EU_AH_00004">EU_AH_00004</MenuItem>
                </Select>
              </span>
              <span>
                &emsp;&emsp;&emsp;&emsp;周转单状态:&emsp;&emsp;&emsp;&emsp;
              </span>
              <span>
                <Select labelId="turnoverStateLabel" id="SturnoverStateSelect" style={{width: '10%' }}>
                  <MenuItem value="完成">完成</MenuItem>
                  <MenuItem value="新增">进行中</MenuItem>
                </Select>
              </span>
            </div>
            <div>
              <br></br>
              <span>
                &emsp;&emsp;&emsp;&emsp;周转单类型:&emsp;&emsp;&emsp;
              </span>
              <span>
                <Select labelId="turnoverTypeLabel" id="SturnoverTypeSelect" style={{width: '10%' }}>
                  <MenuItem value="正向周转">正向周转</MenuItem>
                  <MenuItem value="逆向周转">逆向周转</MenuItem>
                </Select>
              </span>
            </div>
            <div>
              
              <center>
                <br></br>
                
                  <span>
                    <Button variant="contained" onClick={handleClickOpen} size="medium" color="primary" className={classes.margin}>
                      + 新增周转单
                    </Button>
                    <BootstrapDialog
                      onClose={handleClose}
                      aria-labelledby="customized-dialog-title"
                      open={open}>
                      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                        新增周转单
                      </BootstrapDialogTitle>
                      <form id="sinsertForm" autoComplete="on" onSubmit={onSubmit}>
                      <DialogContent dividers>
                        <Typography gutterBottom>
                          <span>*周转单号:</span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                          <span>*客户代码:</span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                          <span>*终端代码:</span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                        </Typography>
                        <Typography gutterBottom>
                          <span>
                            <Input placeho lder="请输入周转单号" onChange={handleChange('transId')}  inputProps={{ 'aria-label': 'description' }} style={{width: '30%' }}/>  
                          </span>
                          &emsp;
                          <span>
                            <Select labelId="customerLabel" id="customerSelect" onChange={handleChange('customerSelect')} style={{width: '30%' }}>
                              <MenuItem value="CU_JS00001">CU_JS00001</MenuItem>
                              <MenuItem value="CU_JS00002">CU_JS00002</MenuItem>
                              <MenuItem value="CU_JS00003">CU_JS00003</MenuItem>
                              <MenuItem value="CU_JS00004">CU_JS00004</MenuItem>
                              <MenuItem value="CU_JS00005">CU_JS00005</MenuItem>
                              <MenuItem value="CU_JS00006">CU_JS00006</MenuItem>
                            </Select>
                          </span>
                          &emsp;
                          <span>
                            <Select labelId="terminalLabel" id="terminalSelect" onChange={handleChange('terminalSelect')} style={{width: '30%' }} >
                              <MenuItem value="EU_HB_00001">EU_HB_00001</MenuItem>
                              <MenuItem value="EU_AH_00001">EU_AH_00001</MenuItem>
                              <MenuItem value="EU_AH_00002">EU_AH_00002</MenuItem>
                              <MenuItem value="EU_NMG_00001">EU_NMG_00001</MenuItem>
                              <MenuItem value="EU_BJ_00001">EU_BJ_00001</MenuItem>
                              <MenuItem value="EU_SC_00001">EU_SC_00001</MenuItem>
                              <MenuItem value="EU_SH_00001">EU_SH_00001</MenuItem>
                              <MenuItem value="EU_HN_00001">EU_HN_00001</MenuItem>
                              <MenuItem value="EU_AH_00003">EU_AH_00003</MenuItem>
                              <MenuItem value="EU_AH_00004">EU_AH_00004</MenuItem>
                            </Select>
                          </span>
                        </Typography>
                        <Typography gutterBottom>
                          周转单类型:
                        </Typography>
                        <Typography gutterBottom>
                        <span>
                          <Select labelId="turnoverTypeLabel" id="turnoverTypeSelect" onChange={handleChange('turnoverTypeSelect')} style={{width: '30%' }}>
                            <MenuItem value="正向周转">正向周转</MenuItem>
                            <MenuItem value="逆向周转">逆向周转</MenuItem>
                          </Select>
                        </span>
                        </Typography>
                        <br></br>
                        <span></span>
                        <Typography gutterBottom>
                          <br></br>
                          <div>
                            订单明细
                            <Button variant="contained" onClick={newBox}>新增一行</Button>
                          </div>
                          
                          <br></br>
                          <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 400 }} aria-label="simple table">
                              <TableHead>
                                <TableRow>
                                  <TableCell>周转箱代码</TableCell>
                                  <TableCell>数量</TableCell>
                                  <TableCell>操作</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody id="transboxes">
                                
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Typography>
                          
                        <DialogActions>
                          <Button autoFocus variant="contained" type="submit" size="medium" color="primary" className={classes.margin}>
                            提交
                          </Button>
                        </DialogActions>

                      </DialogContent>
                      </form>
                    </BootstrapDialog>
                  </span>
                
                &emsp;&emsp;

                <span>
                <Button variant="outlined" onClick={search} color="primary">
                  查询
                </Button>
                </span>
                
                <br></br>
                <br></br>
              </center>
            </div>
          </Paper>
        </div>
        <br></br>
        {/* 一张表 */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>周转单号</TableCell>
                <TableCell align="center">客户代码</TableCell>
                <TableCell align="center">终端代码</TableCell>
                <TableCell align="center">周转单状态</TableCell>
                <TableCell align="center">周转类型</TableCell>
                <TableCell align="center">创建人</TableCell>
                <TableCell align="center">创建时间</TableCell>
                <TableCell align="center">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody id='all_trans'>
            </TableBody>
            <Pagination count={10}  showFirstButton showLastButton onChange={pageNumberOnChange} />
          </Table>
        </TableContainer>
      </div>
    );
}

  export default trans;