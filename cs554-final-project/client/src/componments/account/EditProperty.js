import React, {useContext, useState, useEffect} from 'react';
import { AuthContext } from "../auth/Auth";
import serverController from '../../serverController';
import { Redirect } from "react-router";
import { useAlert } from 'react-alert'
// import Select from 'react-select';
import ReactTooltip from "react-tooltip";
const EditProperty = (props) => {
    const alert = useAlert();
    // const [isSuccess, setIsSuccess] = useState(false);

	const [ propertyData, setPropertyData ] = useState();
	const [ loading, setLoading ] = useState(true);
	const { currentUser } = useContext(AuthContext);

	useEffect(
		() => {
			async function getPropertyData() {
				try {
					setLoading(true);
                    const {data: property}  = await serverController.getProperty(props.match.params.id)
                    
                    setPropertyData(property);
                    // console.log(propertyData);
				} catch (e) {
                    setLoading(false);
					console.log(e)
				}
			}
            getPropertyData();
            setLoading(false);
		},
		[ props.match.params.id ]
	);

    const editProperty = async (event) => {
        event.preventDefault();

        try{
            const data = event.target.elements;

            let time = new Date();
            data.date = Date.parse(time);
            console.log(data);
            if (!data.title.value) throw "title not exist"
            if (data.title.value.length > 70) throw "title too long";
            if(!data.description.value) throw "description not exist"
            if (data.description.value.length > 200) throw "description too long";
            if (!data.bedroom.value) throw "bedroom not exist"
            if (data.bedroom.value < 1 || data.bedroom.value > 10 ) throw "bedroom number invalid";
            if (!data.bath.value) throw "bath not exist"
            if (data.bath.value < 0|| data.bath.value > 10) throw "bath number invalid";
            if (!data.price.value) throw "price not exist"
            if (data.price.value < 0) throw "price invalid";
            if (!data.zipcode.value) throw "zipcode not exist"
            if (data.zipcode.value.length != 5) throw "zipcode invalid";

            await serverController.editProperty(props.match.params.id,currentUser, data);
            // setIsSuccess(true);
            props.history.push("/account")
            alert.success('Edit sucessfully');
        }catch(error){
            alert.error(error)
        }

    }

    // if (isSuccess) {
    //     return <Redirect to="/account/property" />;
    // }

    if (loading) {
        return (
            <div class="lds-facebook"><div></div><div></div><div></div></div>
        )
    }

    if (!propertyData) {
		return (
			<div className='show-body'>
				<p>Property Not Found!</p>
			</div>
		)
    }
    
    return (
		<div className='show-body'>

            <div>
                <h1>Edit</h1>
                <form onSubmit={editProperty}>
                    <div className="row">
                    <div class="col-md-12">
                    <div class="form-group">
                        <label htmlFor="title">Title</label>
                        <input class="form-control" id="title" name="title" placeholder="title" data-tip="title length must less than 70" defaultValue={(propertyData && propertyData.title) || 'Not Provided'}/>
                    </div>
                    </div>
                    <div class="col-md-12">
                    <div class="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" rows="10" class="form-control" name="description" type="text" placeholder="description" data-tip="description length need to less than 200" defaultValue={(propertyData && propertyData.description) || 'Not Provided'}  />
                    </div>
                    </div>

                    <div class="col-md-12">
                        <label>Type</label>
                        <div>
                        <div class="custom-control col-3 custom-radio mb-3">
                            <input name="type" value="apartment" class="custom-control-input" id="type-apartment" type="radio" defaultChecked={propertyData.type === "description"}/>
                            <label class="custom-control-label" for="type-apartment">Apartment</label>
                        </div>
                        <div class="custom-control col-3 custom-radio mb-3">
                            <input name="type" value="house" class="custom-control-input" id="type-house" type="radio" defaultChecked={propertyData.type === "house"} />
                            <label class="custom-control-label" for="type-house">House</label>
                        </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                    <div class="form-group">
                        <label htmlFor="price">Price</label>
                        <input class="form-control" name="price" id="price" placeholder="price" type="number" data-tip="price need to greater than 0" defaultValue={propertyData.price}/>
                    </div>
                    </div>

                    <div class="col-md-3">
                    <div class="form-group">
                        <label htmlFor="zipcode">Zipcode</label>
                        <input class="form-control" id="zipcode" name="zipcode" type="text" placeholder="07030" data-tip="length must equal to 5" defaultValue={ propertyData.zipcode}/>
                    </div>
                    </div>

                    <div class="col-md-3">
                    <div class="form-group">
                        <label htmlFor="bedroom">Bedroom</label>
                        <input class="form-control" id="bedroom" name="bedroom" type="number" placeholder="3" data-tip="bedroom need to greater than 0 and less than 10" defaultValue={ propertyData.bedroom}/>
                    </div>
                    </div>

                    <div class="col-md-3">
                    <div class="form-group">
                        <label htmlFor="bath">Bath</label>
                        <input class="form-control" id="bath" name="bath" type="number" placeholder="1" data-tip="bedroom need to greater than 0 and less than 10" defaultValue={ propertyData.bath}/>
                    </div>
                    </div>
                </div>

                <button className="btn btn-primary" type="submit">Update</button>
                </form>


            </div>
            <ReactTooltip />
		</div>

	);
}
export default EditProperty;