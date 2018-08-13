module Shopify exposing (..)

import AllDict exposing (..)
import Data exposing (..)
import Dict exposing (Dict)
import Json.Decode as JD
import Json.Encode as JE
import Platform
import Ports
import Process
import Rocket exposing ((=>))
import Task


je1 : JE.Value
je1 =
    JE.int 2


jd1 : JD.Decoder Int
jd1 =
    JD.int


main : Program Never Model Msg
main =
    { init = Rocket.batchInit init
    , update = update >> Rocket.batchUpdate
    , subscriptions = subscriptions
    }
        |> Platform.program


type alias Model =
    { settings : Maybe Settings
    , internalCategories : Maybe (Dict InternalCatId InternalCategory)
    , allInternalProducts : Maybe (Dict InternalProductId InternalProduct)
    , allExternalProducts : Maybe (Dict ExternalProductId NormalizedProduct)
    , shopifyCollects : Maybe (List ( ExternalCatId, ExternalProductId ))
    }


type Msg
    = Start
    | Finish


init : ( Model, List (Cmd Msg) )
init =
    ( { settings = Nothing
      , internalCategories = Nothing
      , allInternalProducts = Nothing
      , allExternalProducts = Nothing
      , shopifyCollects = Nothing
      }
    , []
    )


update : Msg -> Model -> ( Model, List (Cmd Msg) )
update msg model =
    case msg of
        Start ->
            [ Process.sleep 6000
                |> Task.andThen (\_ -> Task.succeed ())
                |> Task.perform (\_ -> Finish)
            ]
                |> (,) model
                |> Debug.log "Start"

        Finish ->
            [ Ports.finish () ]
                |> (,) model
                |> Debug.log "Finish"


subscriptions : Model -> Sub Msg
subscriptions model =
    [ Ports.start (\_ -> Start) ]
        |> Sub.batch
