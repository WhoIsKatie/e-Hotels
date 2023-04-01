import React from "react";

const Registration = () => {
	return (
		<>
			<h2 className="text-center mt-5"> Customer Registration </h2>
			<form>
				<div className="d-flex justify-content-around mt-5">
					<label>
						SIN: <input type="text" className="form-control" />
					</label>
					<label>
						First name :{" "}
						<input type="text" className="form-control" />
					</label>
					<label>
						Middle name :{" "}
						<input type="text" className="form-control" />
					</label>
					<label>
						Last name :{" "}
						<input type="text" className="form-control" />
					</label>
					<hr />
				</div>
				<div className="d-flex justify-content-around mt-5">
					<label>
						street number :{" "}
						<input type="text" className="form-control" />
					</label>
					<label>
						street name :{" "}
						<input type="text" className="form-control" />
					</label>
					<label>
						unit: <input type="text" className="form-control" />
					</label>
				</div>
				<div className="d-flex justify-content-center">
					<button className="btn btn-success mt-5"> submit </button>
				</div>
			</form>
		</>
	);
};

export default Registration;
