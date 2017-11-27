package restapi

import (
	"log"
	"strings"

	"database/sql"
	_ "github.com/lib/pq"

	middleware "github.com/go-openapi/runtime/middleware"

	"github.com/opus47/cloud/api/models"
	"github.com/opus47/cloud/api/restapi/operations"
)

const connStr string = "host=172.17.0.2 user=postgres dbname=opus47 sslmode=disable"

/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
///
/// GET /pieces/search
///
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
func handleGetPiecesSearch(
	params operations.GetPiecesSearchParams,
) middleware.Responder {

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Printf("pg-connect error: %v", err)
		return operations.NewGetPiecesSearchInternalServerError()
	}
	defer db.Close()

	result := []*models.Piece{}

	if params.Text == nil {
		return operations.NewGetPiecesSearchOK().WithPayload(result)
	}

	log.Printf("[Pieces-Search] text: %s", *params.Text)

	// build the search string in the format
	// one for the rhythm ---> one:*&for:*&the:*&rhythm:*
	search_string := ""
	fields := strings.Fields(*params.Text)
	for i := 0; i < len(fields)-1; i++ {
		search_string += fields[i] + ":*&"
	}
	search_string += fields[len(fields)-1] + ":*"
	log.Printf("[Pieces-Search] query: %s", search_string)

	rows, err := db.Query(`
	select pid, cfirst, clast, ptitle, kname, pcatalog from mv_pieces
	where document @@ to_tsquery('english', '` + search_string + `')
	`)
	if err != nil {
		log.Printf("pg-querry error: %v", err)
		return operations.NewGetPiecesSearchInternalServerError()
	}

	defer rows.Close()
	for rows.Next() {
		p := &models.Piece{}
		err := rows.Scan(&p.ID, &p.Cfirst, &p.Clast, &p.Title, &p.Key, &p.Catalog)
		if err != nil {
			log.Printf("pg-scan error: %v", err)
			return operations.NewGetPiecesSearchInternalServerError()
		}
		result = append(result, p)
	}

	return operations.NewGetPiecesSearchOK().WithPayload(result)
}

/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
///
/// GET /pieces/{id}
///
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
func handleGetPiecesId(
	params operations.GetPiecesIDParams,
) middleware.Responder {

	// check args
	if params.ID == "" {
		log.Printf("[get-pieces]: no id provided")
		return operations.NewGetPiecesIDBadRequest()
	}

	// init db connection
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Printf("pg-connect error: %v", err)
		return operations.NewGetPiecesIDInternalServerError()
	}
	defer db.Close()

	// get piece info
	piece, errx := fetchPieceInfo(db, params.ID)
	if errx != nil {
		return errx
	}

	//get movement info
	movements, errx := fetchPieceMovements(db, params.ID)
	if errx != nil {
		return errx
	}
	piece.Movements = movements

	//get part info
	parts, errx := fetchPieceParts(db, params.ID)
	if errx != nil {
		return errx
	}
	piece.Parts = parts

	// finito
	return operations.NewGetPiecesIDOK().WithPayload(piece)

}

func fetchPieceInfo(db *sql.DB, id string) (*models.Piece, middleware.Responder) {

	// grab the piece info
	rows, err := db.Query(`
		SELECT p.id, c.first, c.last, p.title, k.name, p.catalog
		FROM pieces AS p
		JOIN composers AS c on p.composer = c.id
		JOIN keys AS k on p.key = k.id
		WHERE p.id = '` + id + `'
	`)

	if err != nil {
		log.Printf("pg-query error: %v", err)
		return nil, operations.NewGetPiecesIDInternalServerError()
	}
	defer rows.Close()

	if !rows.Next() {
		log.Printf("pg-query error: %v key not found", id)
		return nil, operations.NewGetPiecesIDBadRequest()
	}

	result := &models.Piece{}
	err = rows.Scan(
		&result.ID,
		&result.Cfirst,
		&result.Clast,
		&result.Title,
		&result.Key,
		&result.Catalog,
	)
	if err != nil {
		log.Printf("pg-scan error: %v", err)
		return nil, operations.NewGetPiecesIDInternalServerError()
	}

	return result, nil

}

func fetchPieceMovements(db *sql.DB, id string) ([]*models.Movement, middleware.Responder) {

	rows, err := db.Query(`
		SELECT m.id, m.title, m.number
		FROM movements AS m
		JOIN pieces AS p on m.piece = p.id
		WHERE p.id = '` + id + `'
		ORDER BY m.number
	`)

	if err != nil {
		log.Printf("pg-query error: %v", err)
		return nil, operations.NewGetPiecesIDInternalServerError()
	}
	defer rows.Close()

	result := []*models.Movement{}
	for rows.Next() {
		m := &models.Movement{}
		err := rows.Scan(&m.ID, &m.Title, &m.Number)

		if err != nil {
			log.Printf("pg-scan error: %v", err)
			return nil, operations.NewGetPiecesIDInternalServerError()
		}

		result = append(result, m)
	}

	return result, nil

}

func fetchPieceParts(db *sql.DB, id string) ([]*models.Part, middleware.Responder) {

	rows, err := db.Query(`
		SELECT p.id, p.name
		FROM parts as p
		JOIN piece_parts as pp on pp.part = p.id
		WHERE pp.piece = '` + id + `'
	`)

	if err != nil {
		log.Printf("pg-query error: %v", err)
		return nil, operations.NewGetPiecesIDInternalServerError()
	}
	defer rows.Close()

	result := []*models.Part{}
	for rows.Next() {
		p := &models.Part{}
		err := rows.Scan(&p.ID, &p.Name)

		if err != nil {
			log.Printf("pg-scan error: %v", err)
			return nil, operations.NewGetPiecesIDInternalServerError()
		}

		result = append(result, p)
	}

	return result, nil

}

/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
///
/// GET /musicians
///
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
func handleGetMusicians(
	params operations.GetMusiciansParams,
) middleware.Responder {

	// init db connection
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Printf("pg-connect error: %v", err)
		return operations.NewGetPiecesIDInternalServerError()
	}
	defer db.Close()

	rows, err := db.Query(`
		SELECT id, first, COALESCE(middle, ''), last
		FROM musicians
	`)
	if err != nil {
		log.Printf("pg-query error: %v", err)
		return operations.NewGetPiecesIDInternalServerError()
	}
	defer rows.Close()

	result := []*models.Musician{}
	for rows.Next() {
		m := &models.Musician{}
		err = rows.Scan(&m.ID, &m.First, &m.Middle, &m.Last)
		if err != nil {
			log.Printf("pg-scan error: %v", err)
			return operations.NewGetPiecesIDInternalServerError()
		}
		result = append(result, m)
	}

	return operations.NewGetMusiciansOK().WithPayload(result)

}

/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
///
/// GET /pieces/{id}/performances
///
/// Get all the performances for the Piece identified by {id}
///
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
func handleGetPiecePerformances(
	params operations.GetPiecesIDPerformancesParams,
) middleware.Responder {

	// init db connection
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Printf("pg-connect error: %v", err)
		return operations.NewGetPiecesIDInternalServerError()
	}
	defer db.Close()

	rows, err := db.Query(`
		SELECT id, title
		FROM performances
		WHERE piece = '` + params.ID + `'
	`)
	if err != nil {
		log.Printf("pg-query error: %v", err)
		return operations.NewGetPiecesIDInternalServerError()
	}
	defer rows.Close()

	// get top level performance information
	result := []*models.Performance{}
	for rows.Next() {
		p := &models.Performance{}
		err = rows.Scan(&p.ID, &p.Venue)
		if err != nil {
			log.Printf("[performance] pg-scan error: %v", err)
			return operations.NewGetPiecesIDInternalServerError()
		}
		result = append(result, p)
	}
	rows.Close()

	// get performer information
	for _, p := range result {

		rows, err := db.Query(`
			SELECT m.id, m.first, m.last, p.name
			FROM performers as x
			JOIN musicians as m on x.musician = m.id
			JOIN parts as p on x.part = p.id
			WHERE performance = '` + p.ID + `'
		`)
		if err != nil {
			log.Printf("[performance-performers] pg-query error: %v", err)
			return operations.NewGetPiecesIDInternalServerError()
		}
		defer rows.Close()

		for rows.Next() {
			x := &models.Performer{}
			var mfirst, mlast string
			err := rows.Scan(&x.ID, &mfirst, &mlast, &x.Part)
			if err != nil {
				log.Printf("[performance-performers] pg-scan error: %v", err)
				return operations.NewGetPiecesIDInternalServerError()
			}
			x.Musician = mfirst + " " + mlast
			p.Performers = append(p.Performers, x)
		}
	}

	// get recording information
	for _, p := range result {

		rows, err := db.Query(`
			SELECT r.id, r.file, m.title, m.number
			FROM recordings as r
			JOIN movements as m on r.movement = m.id
			WHERE r.performance = '` + p.ID + `'
			ORDER BY m.number
		`)
		if err != nil {
			log.Printf("pg-query error: %v", err)
			return operations.NewGetPiecesIDInternalServerError()
		}
		defer rows.Close()

		for rows.Next() {
			x := &models.Recording{}
			err := rows.Scan(&x.ID, &x.File, &x.Movement, &x.Number)
			if err != nil {
				log.Printf("[performance-recordings] pg-scan error: %v", err)
				return operations.NewGetPiecesIDInternalServerError()
			}
			p.Recordings = append(p.Recordings, x)
		}

	}

	return operations.NewGetPiecesIDPerformancesOK().WithPayload(result)

}
