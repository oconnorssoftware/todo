import React from 'react'
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import useTodoState from './useTodoState';
axios.defaults.baseURL = "http://127.0.0.1:8000/";//URL to django back end

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const ToDoContainer = () => {
  const { todos, addTodo, deleteTodo } = useTodoState([]);

  return (
    <div className="App">
      <Typography component="h1" variant="h2">
        Todos
      </Typography>

      <TodoForm
        saveTodo={todoText => {
          const trimmedText = todoText.trim();

          if (trimmedText.length > 0) {
            addTodo(trimmedText);
          }
        }}
      />

      <TodoList todos={todos} deleteTodo={deleteTodo} />
    </div>
  );
};

class ToDoItem extends React.Component {
  constructor (props) {
    super(props);
    this.state = {

    }
    
  };

  render() {
    return (<h1>TODO {this.props.name}</h1>)
  }  
}

function Item(props) {
  return <li>{props.message}</li>;
}

class ToDo extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      todoinput:"",
      todos:['finish doc', 'submit pr', 'nag dan to review']
    }
    this.handleChange = this.handleChange.bind(this);
    this.addToDo = this.addToDo.bind(this);
  };

  handleChange (evt) {
    this.setState({ [evt.target.name]: evt.target.value});
  }

  addToDo () {
    // this.setState(() => ({
    //       todos: [...this.state.todos, this.state.todoinput]
    //   }))
    let config = {
      headers: {
        "Authorization": "Token "+getCookie("Auth")
      }
    }
    axios.post('coreback/todo/',{ntodo:this.state.todoinput},config
      ).then((response) => {
      // handle success
      console.log(response);
      this.setState(() => ({
          todos: response.data.todos
      }))
      this.setState(() => ({
          todoinput: ""
      }))
    })
    .catch((error) => {
      // handle error
      console.log(error);  
    })

  }
  componentDidMount (){
    let config = {
      headers: {
        "Authorization": "Token "+getCookie("Auth")
      }
    }
    axios.get('coreback/todo/',config
      ).then((response) => {
      // handle success
      console.log(response);
      this.setState(() => ({
          todos: response.data.todos
      }))
    })
    .catch((error) => {
      // handle error
      console.log(error);  
    })
  }

  render() {
    return (<div>
              <br/>
              Todo:<input type="text" value={this.state.todoinput} name="todoinput" onChange={this.handleChange} /><br/>
              <button onClick={this.addToDo}>Add</button>
              <ul>
                {this.state.todos.map((message) => <Item key={message} message={message} />)}
              </ul>
            </div>)
  }
}

class Reg extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username:"",
      email:"",
      password1:"",
      password2:""
    }
    this.handleChange = this.handleChange.bind(this);
    this.registerUser = this.registerUser.bind(this);
  };

  handleChange (evt) {
    this.setState({ [evt.target.name]: evt.target.value});
  }
  registerUser () {
    //http://127.0.0.1:8000/coreback/rest-auth/registration/
    axios.post('coreback/rest-auth/registration/',{ //TODO:add CORS headers
      username:this.state.username,
      email:this.state.email,
      password1:this.state.password1,
      password2:this.state.password2
    }).then((response) => {
      if("key" in response.data){
        axios.defaults.headers.common['Authorization'] = response.data.key;
        setCookie("Auth", response.data.key, 3);
        this.setState(() => ({
          isAuthenticated: true
        }))
        this.props.onLogin(true);
      }
    }).catch((error) => {
      console.log(error);
      if(error.response.status === 400){
        alert("An error occured in registration");
      }
    });
  }
  render() {
    return (
      <div>
        <h1>YOU WANNA MAKE AN ACCOUNT MAN?</h1><br/>
        username:<input type="text" name="username" onChange={this.handleChange} /><br/>
        email:<input type="text" name="email" onChange={this.handleChange} /><br/>
        password<input type="password" name="password1" onChange={this.handleChange} /><br/>
        confirm password<input type="password" name="password2" onChange={this.handleChange} /><br/>
        <button onClick={this.registerUser}>Register</button>
      </div>
      )
  }

}

class Profile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username:""
    }
  };
  componentDidMount (){
    let config = {
      headers: {
        "Authorization": "Token "+getCookie("Auth")
      }
    }
    axios.get('coreback/profile/',config
      ).then((response) => {
      // handle success
      console.log(response);
      this.setState(() => ({
          username: response.data.fname
      }))
    })
    .catch((error) => {
      // handle error
      console.log(error);
      this.setState(() => ({
          isAuthenticated: false
      }))  
    })
  }    
  render() {
    return (<div><h1>Hello:{this.state.username}</h1><ToDo/></div>)
  }

}

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isAuthenticated:false
    }
  };
  onLogin = (val) => {
    this.setState({
      isAuthenticated: val
    })
  };
  componentDidMount (){
    let config = {
      headers: {
        "Authorization": "Token "+getCookie("Auth")
      }
    }
    axios.get('coreback/test_auth/',config
      ).then((response) => {
      // handle success
      console.log(response);
      this.setState(() => ({
          isAuthenticated: true
      }))
    })
    .catch((error) => {
      // handle error
      console.log(error);
      this.setState(() => ({
          isAuthenticated: false
      }))  
    })
  }
  render() {

    if (this.state.isAuthenticated){
      return (<div>
                <Login onLogin={this.onLogin} />
                <h1>WELCOME TO YO HOMESCREEN BRO</h1><br/>
                <Profile />
              </div>)
    }
    
    return (
      <div>
        <Login onLogin={this.onLogin} />
        <Reg onLogin={this.onLogin} />
      </div>
    )
  }
}

class Login extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      email:"",
      password:"",
      redirectToReferrer: false,
      isAuthenticated:false
    };

    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  handleChange (evt) {
    this.setState({ [evt.target.name]: evt.target.value});
  }
  componentDidMount (){
    let config = {
      headers: {
        "Authorization": "Token "+getCookie("Auth")
      }
    }
    axios.get('coreback/test_auth/',config
      ).then((response) => {
      // handle success
      console.log(response);
      this.setState(() => ({
          isAuthenticated: true
      }))
    })
    .catch((error) => {
      // handle error
      console.log(error);
      this.setState(() => ({
          isAuthenticated: false
      }))  
    })
  }
  logout (){

    axios.post('coreback/logout/',{},
      {
        headers: { 
          "Authorization": "Token " + getCookie("Auth")
         }
      }
      ).then((response) => {
      // handle success
      console.log(response);
      setCookie("Auth", "", 0);
      this.setState(() => ({
        isAuthenticated: false
      }))
      this.props.onLogin(false);
    })
    .catch(function (error) {
      // handle error
      console.log(error);   
    })
    
  }
  login (){
    axios.post('coreback/rest-auth/login/',{ //TODO:add CORS headers
      email:this.state.email,
      password:this.state.password
    }).then((response) => {
      if("key" in response.data){
        axios.defaults.headers.common['Authorization'] = response.data.key;
        setCookie("Auth", response.data.key, 3);
        this.setState(() => ({
          isAuthenticated: true
        }))
        this.props.onLogin(true);
      }
    }).catch((error) => {
      if(error.response.status === 400){
        if("email" in error.response.data){
          alert("Please provide a valid email address");
        }
        else{
          alert("Unable to login with provided credentials");
        }
      }
    });

  }
  render() {

    if (this.state.isAuthenticated){
      return (<button onClick={this.logout}>Log out</button>)
    }
    
    return (
      <div>
        <p>You must log in to view the page</p>
        email:<input type="text" name="email" onChange={this.handleChange} />
        password:<input type="password" name="password" onChange={this.handleChange} />
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}


export default function AuthExample () {
  return (
    <div>
      <App />
    </div>
  )
}
