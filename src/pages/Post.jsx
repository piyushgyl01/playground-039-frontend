import React from "react";
import Form from "../components/Form";

export default function Update() {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <Form isEditMode={false} />
        </div>
      </div>
    </div>
  );
}
