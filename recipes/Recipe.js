import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

var defaultRecipes = [
  {title: 'Rum & Coke', ingredients: ['Rum', 'Coke']},
  {title: 'Whiskey Sour', ingredients: ['Whiskey', 'Simple Syrup', 'Lemon Juice']},
  {title: 'Irish Coffee', ingredients: ['Irish Whiskey', 'Coffee', 'Cream']}
]

var recipeStore = {
  recipes: JSON.parse(localStorage.getItem('recipes')) || defaultRecipes
}


class Recipes extends React.Component {

  constructor() {
    super()
    this.state = {
      recipes: recipeStore.recipes

    }
    this.update = this.update.bind(this)
  }

  update() {
    this.setState({
      recipes: recipeStore.recipes
    });
  }

  render() {
    return (
      <MuiThemeProvider>
      <div>
        <div className="page-header text-center">
          <h1>Cocktails</h1>
        </div>  
        { this.state.recipes.map( (recipe, i) => {
          return (<RecipeCard key={i} i={i + 1} recipe={recipe} update={this.update}/>)
        }) }
        <div className="text-center bottom-btn">
          <AddRecipe update={this.update}/>
        </div>
      </div>
      </MuiThemeProvider>
    )
  }
}


class RecipeCard extends React.Component {

  constructor() {
    super()
    this.delete = this.delete.bind(this)
  }

  delete() {
    recipeStore.recipes.splice(this.props.i - 1, 1);
    localStorage.setItem('recipes', JSON.stringify(recipeStore.recipes));
    this.props.update();
  }

  render() {
    const recipe = this.props.recipe;
    return (
      <Card>
        <CardHeader 
          title={recipe.title}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <ul>
            { recipe.ingredients.map( function(ingredient, i) {
                return <Ingredient key={i} ingredient={ingredient} />
            })}
          </ul>
        </CardText>
        <CardActions expandable={true}>
          <div className="row recipe-btn">
            <div>
            <AddRecipe title={recipe.title} 
              ingredients={recipe.ingredients.join(", ")} 
              i={this.props.i}
              update={this.props.update.bind(this)}/>
            </div>
            <div>
            <FlatButton label="Delete" onTouchTap={this.delete}/>
            </div>
          </div>
        </CardActions>
      </Card>    
    )
  }
}


class Ingredient extends React.Component {
  render() {
    return (
      <li>{this.props.ingredient}</li>
    )
  }
}


class AddRecipe extends React.Component {

  constructor() {
    super()
    this.state = {
      open: false,
    }
  }

  handleOpen = () => {
    this.setState({open: true})
  }

  handleClose = () => {
    this.setState({open: false})
  }

  handleSubmit = (event) => {
    event.preventDefault()
    let newRecipe = {
      title: event.target.title.value,
      ingredients: event.target.ingredients.value.split(", ")
    }
    if (this.props.i) {
      recipeStore.recipes[this.props.i - 1] = newRecipe;
    } else {
      recipeStore.recipes.push(newRecipe);
    }
    localStorage.setItem('recipes', JSON.stringify(recipeStore.recipes));
    this.props.update();
    this.setState({open: false});
  }

  render() {
    const mainLabel = this.props.title ? "Edit" : "Add Cocktail";
    const mainStyle = this.props.title ? false : true;
    return (
      <div>
        <FlatButton label={mainLabel} primary={mainStyle} onTouchTap={this.handleOpen}/>
        <Dialog open={this.state.open} onRequestClose={this.handleClose}>
          <form onSubmit={this.handleSubmit}>
            <TextField 
              id="title"
              floatingLabelText="Name"
              defaultValue={this.props.title ? this.props.title : ''}
            /><br/>
            <TextField 
              id="ingredients"
              floatingLabelText="Ingredients, comma, seperated"
              defaultValue={this.props.ingredients ? this.props.ingredients : ''}
            /><br/>
            <FlatButton label="Add" type="submit"/>
            <FlatButton label="Cancel" onTouchTap={this.handleClose}/>
          </form>
        </Dialog>
      </div>
    )
  }
}

export default Recipes;