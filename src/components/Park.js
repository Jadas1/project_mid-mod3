import React, { Component } from 'react';
import { MyContext } from './Provider';

class Park extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props)
    this.state = {
      showImageInput: false,
      hover: false,
      showCategories: false,
      showYesOrNo: '',
      showComments: false,
      showAddComment: false,
      comment: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleYesOrNoHover = this.handleYesOrNoHover.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    
  }

  handleMouseOver() { if (!this.state.hover) this.setState({hover: true}) }

  handleMouseLeave() { if (this.state.hover || this.state.showYesOrNo !== '') this.setState({hover: false, showYesOrNo: ''}) }

  handleYesOrNoHover(q) { this.setState({showYesOrNo: q}) }

  handleClick(item, other) {
    let {
      showImageInput,
      hover,
      showCategories,
      showYesOrNo,
      showComments,
      showAddComment } = this.state

    if (item === 'image' && !showImageInput) this.setState({showImageInput: !showImageInput})
    if (item === 'body' && showImageInput && !hover) this.setState({showImageInput: !showImageInput})
    else if (item !== 'yes' && item !== 'no' && showYesOrNo === '') this.setState({showCategories: !showCategories})
    if (item === 'yes' || item === 'no') {
      let updateData = this.context.update
      let park = this.props.park.id
      updateData([park, other, item], 'vote')
    }
    if (item === 'comments') {
      this.setState({showComments: !this.state.showComments})
    }
    if (item === 'addComment') this.setState({showAddComment: !showAddComment})
  }

  handleChange(e) {
    let { value, name } = e.target
    let updateData = this.context.update
    let park = this.props.park.id
    if (name === 'url' && value.split('://')[0] === 'https') updateData([park, 'image', value], 'updateProperty')
    else if (name === 'name') updateData([park, 'name', value], 'updateProperty')
    else if (name === 'comment') this.setState({comment: e.target.value})

  }

  handleDelete() {
    let updateData = this.context.update
    let park = this.props.park.id
    let deleting = window.confirm('Are you sure you want to delete? This will remove the park entry permanently.')
    if (deleting) {
      console.log('deleteittttt')
      updateData([park], 'deletePark')
    }
  }

  render() {
    let { id, image, name, color } = this.props.park
    let { showImageInput,
      showCategories,
      showYesOrNo,
      showComments,
      showAddComment,
      comment } = this.state
    let { attributes, nycParks } = this.context

    return (
      <React.Fragment>
        <div className='nycPark' style={{backgroundColor: color}} onClick={() => this.handleClick('body')}>
          <img src={image} onClick={() => this.handleClick('image')} />
          <div
            className='imageInput'
            style={{visibility: showImageInput ? 'visible' : 'hidden'}}
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseLeave}
          >
            <label className='labelOne'>Park Name<input onChange={this.handleChange} name='name'/></label>
            <label className='labelTwo'>Image URL<input onChange={this.handleChange} name='url'/></label>
          </div>
          <div
            className='categories'
            style={{visibility: showCategories ? 'visible' : 'hidden'}}
            onMouseLeave={() => this.handleMouseLeave()}
          >
            {attributes.map((a,i) => (
              <div key={i}>
                <span
                  className='question'
                  name={i}
                  onMouseOver={() => this.handleYesOrNoHover(i)}
                  style={{color: nycParks[id]['attributes'][i][0] <= nycParks[id]['attributes'][i][1] ? '#FF5555' : '#C7FFBC'}}
                >
                {a}
                </span>
                <span className='yon' style={{visibility: showYesOrNo === i && showCategories ? 'visible' : 'hidden'}}>
                  <span className='answer' onClick={() => this.handleClick('yes', i)}>Yes</span> <span className='response'>({nycParks[id]['attributes'][i][0]})</span>
                  <span className='answer' onClick={() => this.handleClick('no', i)}>No</span> <span className='response'>({nycParks[id]['attributes'][i][1]})</span>
                </span>
              </div>
            ))}
          </div>
          <div className='defaultImg'>{name ? name : 'DEFAULT'}</div>
          <div className='removePark' onClick={this.handleDelete}>X</div>
          <div className='viewComments' onClick={() => this.handleClick('comments')}>V</div>
        </div>
        <div>
          <div className='addComment' style={{display: showComments ? 'block' : 'none'}}>
            <div className='toggleComment' onClick={() => this.handleClick('addComment')}>+</div>
            <div className='commentHere' style={{display: showAddComment ? 'block' : 'none'}}>
              <h3>Comment:</h3>
              <form className='commentForm' onSubmit={this.handleSubmit}>
                <textarea value={comment} onChange={this.handleChange} name='comment'></textarea>
                <button>Submit</button>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Park;