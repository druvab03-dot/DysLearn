import "./ChildForm.css";

import Input from "../Input/Input";
import Button from "../Button/Button";

function ChildForm({ number }) {

    return (

        <div className="childCard">

            <h3>

                Child {number}

            </h3>

            <Input
                label="Child Name"
                placeholder="Enter child's name"
            />

            <Input
                label="Age"
                type="number"
                placeholder="Enter age"
            />

            <div className="classGroup">

                <label>

                    Class

                </label>

                <select>

                    <option>Select Class</option>

                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>

                </select>

            </div>

            <div className="uploadBox">

                <label>

                    Upload Handwriting Sample (Optional)

                </label>

                <input type="file" />

                <p>

                    JPG • PNG • JPEG • PDF

                </p>

            </div>

        </div>

    )

}

export default ChildForm;