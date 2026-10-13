import "./ChildForm.css";

import Input from "../Input/Input";

function ChildForm({
    number,
    child,
    onChange,
}) {

    return (

        <div className="childCard">

            <h3>

                Child {number}

            </h3>

            <Input
                label="Child Name"
                name="fullName"
                placeholder="Enter child's name"
                value={child.fullName}
                onChange={(e) =>
                    onChange("fullName", e.target.value)
                }
            />

            <div className="classGroup">

                <label>

                    Class

                </label>

                <select
                    value={child.class}
                    onChange={(e) =>
                        onChange("class", e.target.value)
                    }
                >

                    <option value="">Select Class</option>

                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>

                </select>

            </div>

            <div className="uploadBox">

                <label>

                    Handwriting Sample

                </label>

                <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) =>
                        onChange("handwriting", e.target.files[0])
                    }
                />

                <p>

                    Upload one handwriting sample (Required)

                </p>

            </div>

        </div>

    );

}

export default ChildForm;