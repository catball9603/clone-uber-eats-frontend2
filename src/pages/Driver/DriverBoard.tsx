/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { FULL_ORDER_FRAGMENT } from '../../fragments';
import { cookedOrders } from '../../__generated__/cookedOrders';
import { useHistory } from 'react-router-dom';
import { faArrowRight, faKiwiBird } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { takeOrder, takeOrderVariables } from '../../__generated__/takeOrder';

const COOKED_ORDERS_SUBSCRIPTION = gql`
  subscription cookedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🚗</div>;

const DashBoard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();
  const onSucces = ({ coords: { latitude, longitude } }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  const onError = (position: GeolocationPositionError) => {
    console.log(position);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSucces, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng) }, (results, status) => {
        console.log(status, results);
      });
    }
  }, [driverCoords.lat, driverCoords.lng]);

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    console.log(maps);
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };

  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: '#000',
          strokeOpacity: 1,
          strokeWeight: 3,
        },
      });
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
          },
          destination: {
            location: new google.maps.LatLng(driverCoords.lat + 0.05, driverCoords.lng + 0.05),
          },
          travelMode: google.maps.TravelMode.TRANSIT,
        },
        (result) => {
          directionsRenderer.setDirections(result);
        },
      );
    }
  };

  const { data: cookedOrdersData } = useSubscription<cookedOrders>(COOKED_ORDERS_SUBSCRIPTION);

  useEffect(() => {
    if (cookedOrdersData?.cookedOrders.id) {
      makeRoute();
    }
  }, [cookedOrdersData]);
  const history = useHistory();
  const onCompleted = (data: takeOrder) => {
    if (data.takeOrder.ok) {
      history.push(`/orders/${cookedOrdersData?.cookedOrders.id}`);
    }
  };

  const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(TAKE_ORDER_MUTATION, { onCompleted });

  const triggerMutation = (orderId: number) => {
    takeOrderMutation({
      variables: {
        input: {
          id: orderId,
        },
      },
    });
  };

  return (
    <div>
      <div className="overflow-hidden" style={{ width: window.innerWidth, height: '50vh' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCgMXe9Dt1NwK5aJM4HejMknBEeueBkxQU' }}
          defaultZoom={16}
          defaultCenter={{
            lat: 37.48,
            lng: 127.15,
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          draggable={true}
        >
          <Driver
            //@ts-ignore
            lat={driverCoords.lat}
            lng={driverCoords.lng}
          />
        </GoogleMapReact>
      </div>
      <div className="max-w-screen-sm mx-auto bg-white relative -top-10 text-center shadow-lg py-8 px-5">
        {cookedOrdersData?.cookedOrders.restaurant ? (
          <div>
            <h1 className="text-3xl font-bold mb-3"> New Coocked Order</h1>
            <p className="text-2xl mb-5"> Pick it up soon @ {cookedOrdersData?.cookedOrders.restaurant?.name} </p>
            <button
              className="btn w-full block"
              onClick={() => {
                triggerMutation(cookedOrdersData.cookedOrders.id);
              }}
            >
              Accept Challenge <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-14"> New Coocked Order</h1>
            <FontAwesomeIcon className="text-5xl mb-3 text-lime-500" icon={faKiwiBird} />
            <h1 className="text-center text-2xl font-medium mb-5">No orders yet...</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
