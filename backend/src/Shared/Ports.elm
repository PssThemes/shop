port module Shared.Ports exposing
    ( FirebasePushKey
    , finish
    , received_Collects
    , received_ExternalProducts
    , received_InternalProducts
    , received_internalCategories
    , received_settings
    , saveToFirebase
    , start
    )

-- import Data exposing (..)
-- import Dict exposing (Dict)
-- Outgoing ports

import Json.Decode as JD
import Json.Encode as JE


type alias FirebasePushKey =
    String


port saveToFirebase :
    { deleted : List FirebasePushKey
    , created : List JE.Value
    , updated :
        List
            { firebaseKey : FirebasePushKey
            , fieldsToUpdate : JE.Value
            }
    }
    -> Cmd msg


port finish : () -> Cmd msg



-- Incoming ports


port start : (() -> msg) -> Sub msg


port received_settings : (JD.Value -> msg) -> Sub msg


port received_internalCategories : (JD.Value -> msg) -> Sub msg


port received_InternalProducts : (JD.Value -> msg) -> Sub msg


port received_ExternalProducts : (JD.Value -> msg) -> Sub msg


port received_Collects : (JD.Value -> msg) -> Sub msg
