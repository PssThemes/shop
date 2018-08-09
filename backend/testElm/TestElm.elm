port module TestElm exposing (..)

import Platform


--

import Rocket exposing ((=>))
import Json.Decode as JD
import Json.Encode as JE
import Process


-- import Task exposing (..)


je1 : JE.Value
je1 =
    JE.int 1


jd1 : JD.Decoder Int
jd1 =
    JD.int


port start : (() -> msg) -> Sub msg


port finish : () -> Cmd msg


main : Program Never Model Msg
main =
    { init = Rocket.batchInit init
    , update = update >> Rocket.batchUpdate
    , subscriptions = subscriptions
    }
        |> Platform.program


type alias Model =
    String


type Msg
    = Start


init : ( Model, List (Cmd Msg) )
init =
    ( "", [] )


update : Msg -> Model -> ( Model, List (Cmd Msg) )
update msg model =
    case msg of
        Start ->
            [ Process.sleep 2000
                |> (\_ -> finish ())
            ]
                |> (,) model


subscriptions : Model -> Sub Msg
subscriptions model =
    [ start (\_ -> Start) ]
        |> Sub.batch
