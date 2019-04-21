import React, { Component, Fragment } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { Modal, Button, Form, Alert } from "react-bootstrap";

class DogList extends Component {
	constructor() {
		super();
		this.state = {
			dogs: [],
			show: false,
			id: "",
			name: "",
			owner: "",
			notes: "",
			showAlert: false,
			alertType: "success"
		};
	}

	/**
	 * * get all dogs
	 */
	fetchData = () => {
		axios.get("/dogs").then(res => {
			this.setState({ dogs: res.data });
		});
	};

	componentDidMount() {
		this.fetchData();
	}

	/**
	 * * hide alert after 3 seconds
	 */
	hideAlert = () => {
		setTimeout(() => {
			this.setState({ showAlert: false });
		}, 3000);
	};

	/**
	 * * show success if response "message"
	 * * show error if response "error"
	 */
	handleAlert = res => {
		res.data.message &&
			this.setState(
				{ alertType: "success", showAlert: true },
				this.hideAlert()
			);
		res.data.error &&
			this.setState({ alertType: "dander", showAlert: true }, this.hideAlert());
	};

	/**
	 * # update a dog, delete the dog from state
	 * # and append the udpated dog to the state
	 */
	handleUpdate = () => {
		let { id, name, owner, notes, dogs } = this.state;
		dogs = dogs.filter(d => {
			return d.id != id;
		});
		let json = {
			id: id,
			name: name,
			owner: owner,
			notes: notes
		};
		axios
			.put("/dogs/" + id, json)
			.then(res => {
				this.handleAlert(res);
				this.setState({ dogs: [...dogs, res.data.updatedDog] });
			})
			.catch(e => console.log(e));

		/**
		 * ! update the state to triger the component reload
		 */
		// let newArr = this.state.dogs.filter(d => {
		// 	return d.id != id;
		// });
		// newArr.push(json);
		// this.setState({ dogs: newArr });

		this.handleHide();
	};

	/**
	 * * hide modal
	 */
	handleHide = () => {
		this.setState({ show: false });
	};

	/**
	 * !! Handle Add button.
	 * !! Initialize the Dog model and show the modal
	 */
	handleAdd = () => {
		this.setState({
			id: "",
			name: "",
			owner: "",
			notes: "",
			show: true
		});
	};

	/**
	 * # post new dog and append response new dog to state
	 */
	handlePost = () => {
		const { name, owner, notes, dogs } = this.state;
		const json = {
			name: name,
			owner: owner,
			notes: notes
		};
		axios
			.post("/dogs", json)
			.then(res => {
				this.handleAlert(res);
				this.setState({ dogs: [...dogs, res.data.newDog] });
			})
			.catch(e => console.log(e));

		this.handleHide();
	};

	/**
	 * * delete a dog and delete it from the state
	 */
	handleDelete = id => {
		axios
			.delete("/dogs/" + id)
			.then(res => this.handleAlert(res))
			.catch(e => console.log(e));

		let newArr = this.state.dogs.filter(d => {
			return d.id != id;
		});
		this.setState({ dogs: newArr });
	};

	/**
	 * * Handle Edit button click.
	 * * Initialize the form with current dog info
	 */
	handleEdit = dog => {
		let { id, name, owner, notes } = dog;
		this.setState({
			show: true,
			id: id,
			name: name,
			owner: owner,
			notes: notes
		});
	};

	/**
	 * * handle dog form input changes
	 */
	handleChange = e => {
		const { name, value } = e.target;
		this.setState({
			[name]: value
		});
	};

	render() {
		return (
			<Fragment>
				<div className="container">
					<Table striped bordered hover variant="dark">
						<thead>
							<tr>
								<th>
									<a
										href="#"
										onClick={this.handleAdd}
										className="btn btn-success"
									>
										Add New Dog
									</a>
								</th>
								<th>Dog Name</th>
								<th>Dog Owner</th>
								<th>Notes</th>
								<th>Edit</th>
								<th>Delete</th>
							</tr>
						</thead>
						<tbody>
							{this.state.dogs.map(dog => {
								return (
									<tr key={dog.id}>
										<td>{dog.id}</td>
										<td>{dog.name}</td>
										<td>{dog.owner}</td>
										<td>{dog.notes}</td>
										<td>
											<a
												className="btn btn-primary"
												onClick={() => this.handleEdit(dog)}
											>
												Edit
											</a>
										</td>
										<td>
											<a
												className="btn btn-danger"
												onClick={() => this.handleDelete(dog.id)}
											>
												Delete
											</a>
										</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
				</div>

				<Modal
					show={this.state.show}
					onHide={this.handleHide}
					dialogClassName="modal-90w"
				>
					<Modal.Header closeButton>
						<Modal.Title>Edit Dog Information</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<Form>
							<Form.Group controlId="name">
								<Form.Label>Dog Name</Form.Label>
								<Form.Control
									type="text"
									value={this.state.name}
									onChange={this.handleChange}
									name="name"
								/>
							</Form.Group>

							<Form.Group controlId="owner">
								<Form.Label>Dog Owner</Form.Label>
								<Form.Control
									type="text"
									value={this.state.owner}
									onChange={this.handleChange}
									name="owner"
								/>
							</Form.Group>
							<Form.Group controlId="notes">
								<Form.Label>Notes</Form.Label>
								<Form.Control
									type="text"
									value={this.state.notes}
									onChange={this.handleChange}
									name="notes"
								/>
							</Form.Group>
						</Form>
					</Modal.Body>

					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleHide}>
							Close
						</Button>
						{/* 
					If this.state.id is populated, then modal is triggered by edit button
					Then this button will be Update. Otherwise it will be Add.
					*/}

						{this.state.id ? (
							<Button variant="primary" onClick={this.handleUpdate}>
								Update
							</Button>
						) : (
							<Button variant="primary" onClick={this.handlePost}>
								Add
							</Button>
						)}

						<Button
							onClick={() => this.handleDelete(this.state.id)}
							variant="danger"
						>
							Delete
						</Button>
					</Modal.Footer>
				</Modal>

				<Alert variant={this.state.alertType} show={this.state.showAlert}>
					{this.state.alertType == "error"
						? "Something went wrong!"
						: "Success"}
				</Alert>
			</Fragment>
		);
	}
}

export default DogList;
